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
] as const;

const COMPONENT_EXPORTS = [
  "default",
  "ErrorBoundary",
  "HydrateFallback",
  "Layout",
] as const;
type ComponentExport = (typeof COMPONENT_EXPORTS)[number];
const COMPONENT_EXPORTS_SET = new Set(COMPONENT_EXPORTS);
function isComponentExport(name: string): name is ComponentExport {
  return COMPONENT_EXPORTS_SET.has(name as ComponentExport);
}

const CLIENT_NON_COMPONENT_EXPORTS = [
  "clientAction",
  "clientLoader",
  "unstable_clientMiddleware",
  "handle",
  "meta",
  "links",
  "shouldRevalidate",
] as const;
type ClientNonComponentExport = (typeof CLIENT_NON_COMPONENT_EXPORTS)[number];
const CLIENT_NON_COMPONENT_EXPORTS_SET = new Set(CLIENT_NON_COMPONENT_EXPORTS);
function isClientNonComponentExport(
  name: string,
): name is ClientNonComponentExport {
  return CLIENT_NON_COMPONENT_EXPORTS_SET.has(name as ClientNonComponentExport);
}

const CLIENT_ROUTE_EXPORTS = [
  ...CLIENT_NON_COMPONENT_EXPORTS,
  ...COMPONENT_EXPORTS,
] as const;

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
    const assets: Array<TransformerResult | MutableAsset> = [asset];

    const routeSource = await asset.getCode();
    const staticExports = await parseExports(asset.filePath, routeSource);
    const isServerFirstRoute = staticExports.some(
      (staticExport) => staticExport === "ServerComponent",
    );
    const needsDefaultRootErrorBoundary =
      asset.query.get("root") === "true" &&
      !staticExports.includes("ErrorBoundary");

    // TODO: Add sourcemaps.....
    // TODO: Maybe pass TSConfig in here?
    const transformed = oxcTransform.transform(asset.filePath, routeSource);
    const ast = babel.parse(transformed.code, {
      sourceType: "module",
    });

    function getClientModuleId(): string {
      const id = "client-route-module";

      if (assets.some((a) => a.uniqueKey === id)) {
        return id;
      }

      let content = '"use client";\n';
      for (const staticExport of staticExports) {
        const isClientComponent =
          !isServerFirstRoute && isComponentExport(staticExport);
        if (isClientComponent || isClientNonComponentExport(staticExport)) {
          content += `export { ${staticExport} } from "${getClientSourceModuleId()}";\n`;
        }
      }

      if (needsDefaultRootErrorBoundary) {
        const hasRootLayout = staticExports.includes("Layout");
        content += `import { UNSAFE_RSCDefaultRootErrorBoundary } from "react-router";\n`;
        content += `export function ErrorBoundary() { return <UNSAFE_RSCDefaultRootErrorBoundary hasRootLayout={${hasRootLayout}} />; }\n`;
      }

      assets.push({
        uniqueKey: id,
        type: "jsx",
        content,
      });

      return id;
    }

    function getClientSourceModuleId(): string {
      const id = "client-route-module-source";

      if (assets.some((a) => a.uniqueKey === id)) {
        return id;
      }

      const exportsToRemove = isServerFirstRoute
        ? [...SERVER_ONLY_ROUTE_EXPORTS, ...COMPONENT_EXPORTS]
        : SERVER_ONLY_ROUTE_EXPORTS;

      let clientRouteModuleAst = babel.cloneNode(ast, true);
      removeExports(clientRouteModuleAst, exportsToRemove);

      let content =
        '"use client";\n' + babel.generate(clientRouteModuleAst).code;

      assets.push({
        uniqueKey: id,
        type: "jsx",
        content,
      });

      return id;
    }

    function getServerModuleId(): string {
      const id = "server-route-module";

      if (assets.some((a) => a.uniqueKey === id)) {
        return id;
      }

      // server route module
      let serverRouteModuleAst = babel.cloneNode(ast, true);
      removeExports(
        serverRouteModuleAst,
        isServerFirstRoute
          ? CLIENT_NON_COMPONENT_EXPORTS
          : CLIENT_ROUTE_EXPORTS,
      );

      let content = babel.generate(serverRouteModuleAst).code;
      if (!isServerFirstRoute) {
        for (const staticExport of staticExports) {
          if (isClientNonComponentExport(staticExport)) {
            content += `export { ${staticExport} } from "${getClientModuleId()}";\n`;
          } else if (isComponentExport(staticExport)) {
            // Wrap all route-level client components in server components when
            // it's not a server-first route so Parcel can use the server
            // component to inject CSS resources into the JSX
            const isDefault = staticExport === "default";
            const componentName = isDefault ? "Component" : staticExport;
            content += `import { ${staticExport} as Client${componentName} } from "${getClientModuleId()}";\n`;
            content += `export ${isDefault ? "default" : `const ${staticExport} =`} function ${componentName}(props) {
              return <Client${componentName} {...props} />;
            }\n`;
          }
        }
      }

      assets.push({
        uniqueKey: id,
        type: "jsx",
        content,
      });

      return id;
    }

    let code = "";
    if (isServerFirstRoute) {
      for (const staticExport of staticExports) {
        if (isClientNonComponentExport(staticExport)) {
          code += `export { ${staticExport} } from "${getClientModuleId()}";\n`;
        } else if (staticExport === "ServerComponent") {
          code += `export { ServerComponent as default } from "${getServerModuleId()}";\n`;
        } else {
          code += `export { ${staticExport} } from "${getServerModuleId()}";\n`;
        }
      }
    } else {
      for (const staticExport of staticExports) {
        if (isClientNonComponentExport(staticExport)) {
          code += `export { ${staticExport} } from "${getClientModuleId()}";\n`;
        } else {
          code += `export { ${staticExport} } from "${getServerModuleId()}";\n`;
        }
      }
    }

    if (needsDefaultRootErrorBoundary) {
      code += `export { ErrorBoundary } from "${getClientModuleId()}";\n`;
    }

    asset.setCode(code);
    return assets;
  },
});
