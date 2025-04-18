import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import oxc from "oxc-parser";
import oxcTransform from "oxc-transform";

import { Resolver } from "@parcel/plugin";
import type { Config } from "@react-router/dev/config";
import {
  type RouteConfig,
  type RouteConfigEntry,
} from "@react-router/dev/routes";
import { createJiti } from "jiti";

import { generate, parse } from "./babel/babel.mts";
import { removeExports } from "./babel/remove-exports.mts";

const loader = createJiti(import.meta.url);

const SERVER_ONLY_ROUTE_EXPORTS = [
  "loader",
  "action",
  "unstable_middleware",
  "headers",
];
const SERVER_ONLY_ROUTE_EXPORTS_SET = new Set(SERVER_ONLY_ROUTE_EXPORTS);
const CLIENT_NON_COMPONENT_EXPORTS = [
  "clientAction",
  "clientLoader",
  "unstable_clientMiddleware",
  "handle",
  "meta",
  "links",
  "shouldRevalidate",
];
const CLIENT_ROUTE_EXPORTS = [
  ...CLIENT_NON_COMPONENT_EXPORTS,
  "default",
  "ErrorBoundary",
  "HydrateFallback",
  "Layout",
];
const CLIENT_ROUTE_EXPORTS_SET = new Set(CLIENT_ROUTE_EXPORTS);

export default new Resolver({
  async loadConfig({ config, options }) {
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
  import { ServerRouteObject } from "react-router/server";
  const routes: ServerRouteObject[];
  export default routes;
}`.trim()
    );

    // These aren't used by the build, but written as an example to copy and paste if
    // the user wants to take over control of the entry points.
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    await fsp.mkdir("./.react-router-parcel/entries", { recursive: true });
    await Promise.all([
      fsp.copyFile(
        path.join(__dirname, "entry.client.tsx"),
        "./.react-router-parcel/entries/entry.client.tsx"
      ),
      fsp.copyFile(
        path.join(__dirname, "entry.rsc.ts"),
        "./.react-router-parcel/entries/entry.rsc.ts"
      ),
      fsp.copyFile(
        path.join(__dirname, "entry.server.tsx"),
        "./.react-router-parcel/entries/entry.server.tsx"
      ),
    ]);

    const configPath = path.resolve(
      options.projectRoot,
      "react-router.config.ts"
    );

    config.invalidateOnFileChange(configPath);
    config.invalidateOnFileCreate({
      filePath: configPath,
    });

    const rrConfig = await loader
      .import(configPath)
      .then((mod) => (mod as { default: Config }).default)
      .catch((): Config => {
        console.warn("No react-router.config.ts found, using defaults");
        return {};
      });

    const appDirectory = path.resolve(
      options.projectRoot,
      rrConfig.appDirectory || "app"
    );
    const routesPath = path.join(appDirectory, "routes.ts");

    config.invalidateOnFileChange(routesPath);
    config.invalidateOnFileCreate({
      filePath: routesPath,
    });

    let routes = await loader
      .import(routesPath)
      .then((mod) => (mod as { default: RouteConfig }).default)
      .catch(() => {
        console.warn("No routes.ts found, using empty routes.");
        return [];
      });

    routes = [
      {
        id: "root",
        file: "root.tsx",
        children: routes,
      },
    ];

    return { appDirectory, routes };
  },
  async resolve({ config, options, specifier }) {
    if (specifier === "virtual:react-router/express") {
      const filePath = fileURLToPath(import.meta.resolve("./entry.server.tsx"));
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
          path.resolve(config.appDirectory, route.file) + "?route-module"
        )}),`;

        code += `id: ${JSON.stringify(route.id || createRouteId(route.file))},`;
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
        filePath: path.join(config.appDirectory, "routes.ts"),
        code,
      };
    }

    const parseExports = async (filePath: string, source: string) => {
      const parsed = await oxc.parseAsync(filePath, source);

      const routeExports: string[] = [];
      for (const staticExport of parsed.module.staticExports) {
        for (const entry of staticExport.entries) {
          if (entry.exportName.name) {
            routeExports.push(entry.exportName.name);
          } else {
            routeExports.push("default");
          }
        }
      }
      return routeExports;
    };

    // "?client-route-module"
    // "?server-route-module"
    if (specifier.endsWith("?route-module")) {
      const filePath = path.resolve(
        config.appDirectory,
        specifier.slice(0, -"?route-module".length)
      );
      const routeSource = await fsp.readFile(filePath, "utf-8");
      const staticExports = await parseExports(filePath, routeSource);

      let code = "";
      for (const staticExport of staticExports) {
        if (staticExport) {
          if (CLIENT_ROUTE_EXPORTS_SET.has(staticExport)) {
            code += `export { ${staticExport} } from ${JSON.stringify(filePath + "?client-route-module")};\n`;
          } else {
            code += `export { ${staticExport} } from ${JSON.stringify(filePath + "?server-route-module")};\n`;
          }
        } else {
          code += `export { default } from ${JSON.stringify(filePath + "?client-route-module")};\n`;
        }
      }

      return {
        filePath,
        code,
        invalidateOnFileChange: [filePath],
      };
    }

    if (specifier.endsWith("?client-route-module")) {
      const filePath = path.resolve(
        config.appDirectory,
        specifier.slice(0, -"?client-route-module".length)
      );

      const routeSource = await fsp.readFile(filePath, "utf-8");

      // TODO: Add sourcemaps.....
      // TODO: Maybe pass TSConfig in here?
      const transformed = oxcTransform.transform(filePath, routeSource);
      const ast = parse(transformed.code, {
        sourceType: "module",
      });
      removeExports(ast, SERVER_ONLY_ROUTE_EXPORTS);

      let code = '"use client";\n' + generate(ast).code;

      return {
        filePath: path.join(
          path.dirname(filePath),
          path.basename(filePath) +
            ".___client-route-module___" +
            path.extname(filePath)
        ),
        code,
        invalidateOnFileChange: [filePath],
      };
    }

    if (specifier.endsWith("?server-route-module")) {
      const filePath = path.resolve(
        config.appDirectory,
        specifier.slice(0, -"?server-route-module".length)
      );
      const routeSource = await fsp.readFile(filePath, "utf-8");
      const staticExports = await parseExports(filePath, routeSource);

      // TODO: Add sourcemaps.....
      // TODO: Maybe pass TSConfig in here?
      const transformed = oxcTransform.transform(filePath, routeSource);
      const ast = parse(transformed.code, {
        sourceType: "module",
      });
      removeExports(ast, CLIENT_ROUTE_EXPORTS);

      let code = generate(ast).code;
      for (const staticExport of staticExports) {
        if (CLIENT_ROUTE_EXPORTS_SET.has(staticExport)) {
          code += `export { ${staticExport} } from ${JSON.stringify(filePath + "?client-route-module")};\n`;
        }
      }

      return {
        filePath: path.join(
          path.dirname(filePath),
          path.basename(filePath) +
            ".___server-route-module___" +
            path.extname(filePath)
        ),
        code,
        invalidateOnFileChange: [filePath],
      };
    }
  },
});

function createRouteId(file: string) {
  return path.basename(file).slice(0, -path.extname(file).length);
}
