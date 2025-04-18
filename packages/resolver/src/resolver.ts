import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import oxc from "oxc-parser";
import oxcTransform from "oxc-transform";

import { Resolver } from "@parcel/plugin";
import type { Config } from "@react-router/dev/config";
import {
  type RouteConfig,
  type RouteConfigEntry,
} from "@react-router/dev/routes";
import { createJiti } from "jiti";

import { generate, parse } from "./babel/babel.ts";
import { removeExports } from "./babel/remove-exports.ts";

const loader = createJiti(pathToFileURL(__filename).href);

const SERVER_ONLY_ROUTE_EXPORTS = [
  "loader",
  "action",
  "unstable_middleware",
  "headers",
  "ServerComponent",
];

const COMPONENT_EXPORTS = ["ErrorBoundary", "HydrateFallback", "Layout"];

const CLIENT_NON_COMPONENT_EXPORTS = [
  "clientAction",
  "clientLoader",
  "unstable_clientMiddleware",
  "handle",
  "meta",
  "links",
  "shouldRevalidate",
];
const CLIENT_NON_COMPONENT_EXPORTS_SET = new Set(CLIENT_NON_COMPONENT_EXPORTS);
const CLIENT_ROUTE_EXPORTS = [
  ...CLIENT_NON_COMPONENT_EXPORTS,
  ...COMPONENT_EXPORTS,
  "default",
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

    const configPath = path.resolve(process.cwd(), "react-router.config.ts");

    config.invalidateOnFileChange(configPath);
    config.invalidateOnFileCreate({
      filePath: configPath,
    });

    const rrConfig = await loader
      .import(configPath)
      .then((mod) => {
        return (mod as { default: Config }).default;
      })
      .catch((): Config => {
        return {};
      });

    const appDirectory = path.resolve(
      process.cwd(),
      rrConfig.appDirectory || "app"
    );
    const routesPath = path.join(appDirectory, "routes.ts");

    config.invalidateOnFileChange(routesPath);
    config.invalidateOnFileCreate({
      filePath: routesPath,
    });

    let routes = await loader
      .import(routesPath)
      .then((mod) => (mod as { default: RouteConfig }).default);
    routes = [
      {
        id: "root",
        file: "root.tsx",
        children: routes,
      },
    ];

    return { appDirectory, routes };
  },
  async resolve({ config, specifier }) {
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

    if (specifier.endsWith("?route-module")) {
      const filePath = path.resolve(
        config.appDirectory,
        specifier.slice(0, -"?route-module".length)
      );
      const routeSource = await fsp.readFile(filePath, "utf-8");
      const staticExports = await parseExports(filePath, routeSource);

      const isServerFirstRoute = staticExports.some(
        (staticExport) => staticExport === "ServerComponent"
      );

      let code = "";

      if (isServerFirstRoute) {
        for (const staticExport of staticExports) {
          if (CLIENT_NON_COMPONENT_EXPORTS_SET.has(staticExport)) {
            code += `export { ${staticExport} } from ${JSON.stringify(
              filePath + "?client-route-module"
            )};\n`;
          } else if (staticExport === "ServerComponent") {
            code += `export { ServerComponent as default } from ${JSON.stringify(
              filePath + "?server-route-module"
            )};\n`;
          } else {
            code += `export { ${staticExport} } from ${JSON.stringify(
              filePath + "?server-route-module"
            )};\n`;
          }
        }
      } else {
        for (const staticExport of staticExports) {
          if (CLIENT_ROUTE_EXPORTS_SET.has(staticExport)) {
            code += `export { ${staticExport} } from ${JSON.stringify(
              filePath + "?client-route-module"
            )};\n`;
          } else {
            code += `export { ${staticExport} } from ${JSON.stringify(
              filePath + "?server-route-module"
            )};\n`;
          }
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
      const staticExports = await parseExports(filePath, routeSource);

      const isServerFirstRoute = staticExports.some(
        (staticExport) => staticExport === "ServerComponent"
      );

      // TODO: Add sourcemaps.....
      // TODO: Maybe pass TSConfig in here?
      const transformed = oxcTransform.transform(filePath, routeSource);
      const ast = parse(transformed.code, {
        sourceType: "module",
      });

      const exportsToRemove = isServerFirstRoute
        ? [...SERVER_ONLY_ROUTE_EXPORTS, ...COMPONENT_EXPORTS]
        : SERVER_ONLY_ROUTE_EXPORTS;

      removeExports(ast, exportsToRemove);

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

      const isServerFirstRoute = staticExports.some(
        (staticExport) => staticExport === "ServerComponent"
      );

      // TODO: Add sourcemaps.....
      // TODO: Maybe pass TSConfig in here?
      const transformed = oxcTransform.transform(filePath, routeSource);
      const ast = parse(transformed.code, {
        sourceType: "module",
      });
      removeExports(
        ast,
        isServerFirstRoute ? CLIENT_NON_COMPONENT_EXPORTS : CLIENT_ROUTE_EXPORTS
      );

      let code = generate(ast).code;
      if (!isServerFirstRoute) {
        for (const staticExport of staticExports) {
          if (CLIENT_ROUTE_EXPORTS_SET.has(staticExport)) {
            code += `export { ${staticExport} } from ${JSON.stringify(
              filePath + "?client-route-module"
            )};\n`;
          }
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
