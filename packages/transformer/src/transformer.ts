import oxc from "oxc-parser";
import oxcTransform from "oxc-transform";
import { Transformer } from "@parcel/plugin";
import type { TransformerResult, MutableAsset } from "@parcel/types";

import * as babel from "./babel/babel.ts";
import { removeExports } from "./babel/remove-exports.ts";

const SERVER_ONLY_ROUTE_EXPORTS = [
  "loader",
  "action",
  "unstable_middleware",
  "headers",
  "ServerComponent",
];

const COMPONENT_EXPORTS = [
  "default",
  "ErrorBoundary",
  "HydrateFallback",
  "Layout",
];
const COMPONENT_EXPORTS_SET = new Set(COMPONENT_EXPORTS);

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
];

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

export default new Transformer({
  async transform({ asset }) {
    const routeSource = await asset.getCode();
    const staticExports = await parseExports(asset.filePath, routeSource);
    const isServerFirstRoute = staticExports.some(
      (staticExport) => staticExport === "ServerComponent"
    );

    // TODO: Add sourcemaps.....
    // TODO: Maybe pass TSConfig in here?
    const transformed = oxcTransform.transform(asset.filePath, routeSource);
    const ast = babel.parse(transformed.code, {
      sourceType: "module",
    });

    let assets: Array<TransformerResult | MutableAsset> = [asset];

    function createClientRouteModule() {
      if (assets.some(a => a.uniqueKey === 'client-route-module')) {
        return;
      }

      let clientRouteModule = '"use client";';
      for (const staticExport of staticExports) {
        if (!isServerFirstRoute && COMPONENT_EXPORTS_SET.has(staticExport)) {
          const isDefault = staticExport === "default";
          const componentName = isDefault ? "Component" : staticExport;
          clientRouteModule += `import { use${componentName}Props } from "parcel-transformer-react-router-experimental/dist/client-route-component-props.js";\n`;
          clientRouteModule += `import { ${staticExport} as Source${componentName} } from "client-route-module-source";\n`;

          clientRouteModule += `export ${isDefault ? "default" : `const ${staticExport} =`} function DecoratedRoute${componentName}() {
            return <Source${componentName} {...use${componentName}Props()} />;
          }\n`;
          createClientRouteModuleSource();
        } else if (CLIENT_NON_COMPONENT_EXPORTS_SET.has(staticExport)) {
          clientRouteModule += `export { ${staticExport} } from "client-route-module-source";\n`;
          createClientRouteModuleSource();
        }
      }

      assets.push({
        uniqueKey: 'client-route-module',
        type: 'jsx',
        content: clientRouteModule
      });
    }

    function createClientRouteModuleSource() {
      if (assets.some(a => a.uniqueKey === 'client-route-module-source')) {
        return;
      }

      const exportsToRemove = isServerFirstRoute
        ? [...SERVER_ONLY_ROUTE_EXPORTS, ...COMPONENT_EXPORTS]
        : SERVER_ONLY_ROUTE_EXPORTS;

      let clientRouteModuleAst = babel.cloneNode(ast, true);
      removeExports(clientRouteModuleAst, exportsToRemove);

      let clientRouteModuleSource = '"use client";\n' + babel.generate(clientRouteModuleAst).code;
      assets.push({
        uniqueKey: 'client-route-module-source',
        type: 'jsx',
        content: clientRouteModuleSource
      });
    }

    function createServerRouteModule() {
      if (assets.some(a => a.uniqueKey === 'server-route-module')) {
        return;
      }

      // server route module
      let serverRouteModuleAst = babel.cloneNode(ast, true);
      removeExports(
        serverRouteModuleAst,
        isServerFirstRoute ? CLIENT_NON_COMPONENT_EXPORTS : CLIENT_ROUTE_EXPORTS
      );

      let serverRouteModule = babel.generate(serverRouteModuleAst).code;
      if (!isServerFirstRoute) {
        for (const staticExport of staticExports) {
          if (CLIENT_NON_COMPONENT_EXPORTS_SET.has(staticExport)) {
            serverRouteModule += `export { ${staticExport} } from "client-route-module";\n`;
            createClientRouteModule();
          } else if (COMPONENT_EXPORTS_SET.has(staticExport)) {
            // Wrap all route-level client components in server components when
            // it's not a server-first route so Parcel can use the server
            // component to inject CSS resources into the JSX
            const isDefault = staticExport === "default";
            const componentName = isDefault ? "Component" : staticExport;
            serverRouteModule += `import { ${staticExport} as Client${componentName} } from "client-route-module";\n`;
            serverRouteModule += `export ${isDefault ? "default" : `const ${staticExport} =`} function ${componentName}() {
              return <Client${componentName} />;
            }\n`;
            createClientRouteModule();
          }
        }
      }

      assets.push({
        uniqueKey: 'server-route-module',
        type: 'jsx',
        content: serverRouteModule
      });
    }

    let code = "";
    if (isServerFirstRoute) {
      for (const staticExport of staticExports) {
        if (CLIENT_NON_COMPONENT_EXPORTS_SET.has(staticExport)) {
          code += `export { ${staticExport} } from "client-route-module"};\n`;
          createClientRouteModule();
        } else if (staticExport === "ServerComponent") {
          code += `export { ServerComponent as default } from "server-route-module";\n`;
          createServerRouteModule();
        } else {
          code += `export { ${staticExport} } from "server-route-module";\n`;
          createServerRouteModule();
        }
      }
    } else {
      for (const staticExport of staticExports) {
        if (CLIENT_NON_COMPONENT_EXPORTS_SET.has(staticExport)) {
          code += `export { ${staticExport} } from "client-route-module";\n`;
          createClientRouteModule();
        } else {
          code += `export { ${staticExport} } from "server-route-module";\n`;
          createServerRouteModule();
        }
      }
    }

    asset.setCode(code);
    return assets;
  }
});
