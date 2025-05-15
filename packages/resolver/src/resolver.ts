import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { pathToFileURL } from "node:url";

import { Resolver } from "@parcel/plugin";
import type { Config } from "@react-router/dev/config";
import {
  type RouteConfig,
  type RouteConfigEntry,
} from "@react-router/dev/routes";
import { createJiti } from "jiti";

const loader = createJiti(pathToFileURL(__filename).href);

export default new Resolver({
  async loadConfig({ config }) {
    await fsp.mkdir(".react-router-parcel/types", { recursive: true });
    await fsp.writeFile(
      ".react-router-parcel/types/+virtual-parcel.d.ts",
      `
declare module "virtual:react-router/express" {
  import { Express } from "express";
  const express: Express;
  export default express;
}

declare module "virtual:react-router/routes" {
  import { ServerRouteObject } from "react-router/rsc";
  const routes: ServerRouteObject[];
  export default routes;
}`.trim()
    );

    // These aren't used by the build, but written as an example to copy and paste if
    // the user wants to take over control of the entry points.
    await fsp.mkdir("./.react-router-parcel/entries", { recursive: true });
    await Promise.all([
      fsp.copyFile(
        path.join(__dirname, "entry.browser.tsx"),
        "./.react-router-parcel/entries/entry.browser.tsx"
      ),
      fsp.copyFile(
        path.join(__dirname, "entry.rsc.ts"),
        "./.react-router-parcel/entries/entry.rsc.ts"
      ),
      fsp.copyFile(
        path.join(__dirname, "entry.ssr.tsx"),
        "./.react-router-parcel/entries/entry.ssr.tsx"
      ),
    ]);

    // const configPath = path.resolve(process.cwd(), "react-router.config.ts");
    const configPath = await findCodeFile(process.cwd(), "react-router.config");

    if (configPath) {
      config.invalidateOnFileChange(configPath);
      config.invalidateOnFileCreate({
        filePath: configPath,
      });
    } else {
      config.invalidateOnFileCreate({
        filePath: path.join(process.cwd(), "react-router.config.ts"),
      });
      config.invalidateOnFileCreate({
        filePath: path.join(process.cwd(), "react-router.config.tsx"),
      });
      config.invalidateOnFileCreate({
        filePath: path.join(process.cwd(), "react-router.config.js"),
      });
      config.invalidateOnFileCreate({
        filePath: path.join(process.cwd(), "react-router.config.jsx"),
      });
    }

    const rrConfig = configPath
      ? await loader
          .import(configPath)
          .then((mod) => {
            return (mod as { default: Config }).default;
          })
          .catch((): Config => {
            return {};
          })
      : ({} satisfies Config);

    const appDirectory = path.resolve(
      process.cwd(),
      rrConfig.appDirectory || "app"
    );
    // const routesPath = path.join(appDirectory, "routes.ts");
    const routesPath = await findCodeFile(appDirectory, "routes");

    if (!routesPath) {
      throw new Error(
        `Could not find routes.[ts|tsx|js|jsx] in ${appDirectory}. Please create one.`
      );
    }

    config.invalidateOnFileChange(routesPath);
    config.invalidateOnFileCreate({
      filePath: routesPath,
    });

    global.__reactRouterAppDirectory = appDirectory;
    let routes = await loader
      .import(routesPath)
      .then(
        (mod) =>
          (mod as { default: RouteConfig }).default ?? (mod as RouteConfig)
      );

    const rootFile = await findCodeFile(appDirectory, "root");

    if (!rootFile) {
      throw new Error(
        `Could not find root.[ts|tsx|js|jsx] in ${appDirectory}. Please create one.`
      );
    }

    routes = [
      {
        id: "root",
        path: "",
        file: path.basename(rootFile),
        children: routes,
      },
    ];

    return { appDirectory, routes, routesPath };
  },
  async resolve({ config, specifier, options }) {
    if (specifier === "virtual:react-router/express") {
      const filePath = path.resolve(__dirname, "./entry.ssr.tsx");
      const code = await fsp.readFile(filePath, "utf-8");
      return {
        filePath,
        code,
      };
    }

    if (specifier === "virtual:react-router/routes") {
      let code = "export default [";

      const closeRouteSymbol = Symbol("CLOSE_ROUTE");
      let stack: Array<typeof closeRouteSymbol | RouteConfigEntry> = [
        ...config.routes,
      ];
      while (stack.length > 0) {
        const route = stack.pop();
        if (!route) break;
        if (route === closeRouteSymbol) {
          code += "]},";
          continue;
        }

        code += "{";
        code += `lazy: () => import(${JSON.stringify(
          "route-module:/" + path.relative(options.projectRoot, path.resolve(config.appDirectory, route.file))
        )}),`;

        code += `id: ${JSON.stringify(route.id || createRouteId(route.file, config.appDirectory))},`;
        if (typeof route.path === "string") {
          code += `path: ${JSON.stringify(route.path)},`;
        }
        if (route.index) {
          code += `index: true,`;
        }
        if (route.caseSensitive) {
          code += `caseSensitive: true,`;
        }
        if (route.children) {
          code += ["children:["];
          stack.push(closeRouteSymbol);
          stack.push(...[...route.children].reverse());
        } else {
          code += "},";
        }
      }

      code += "];\n";

      return {
        filePath: config.routesPath,
        code,
      };
    }
  },
});

function createRouteId(file: string, appDirectory: string) {
  return path
    .relative(appDirectory, file)
    .replace(/\\+/, "/")
    .slice(0, -path.extname(file).length);
}

async function findFileWithExtension(
  dir: string,
  base: string,
  extensions: string[]
) {
  for (const ext of extensions) {
    const filePath = path.join(dir, base + ext);
    if (await fsp.stat(filePath).catch(() => false)) {
      return filePath;
    }
  }
  return null;
}

function findCodeFile(dir: string, base: string) {
  return findFileWithExtension(dir, base, [".ts", ".tsx", ".js", ".jsx"]);
}
