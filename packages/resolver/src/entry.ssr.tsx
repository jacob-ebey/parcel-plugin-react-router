import * as React from "react" assert { env: "react-client" };
import { createRequestListener } from "@mjackson/node-fetch-server";
import express from "express";
// @ts-expect-error - no types
import { renderToReadableStream as renderHTMLToReadableStream } from "react-dom/server.edge" assert { env: "react-client" };
import {
  routeRSCServerRequest,
  RSCStaticRouter,
} from "react-router" assert { env: "react-client" };
// @ts-expect-error
import { createFromReadableStream } from "react-server-dom-parcel/client.edge" assert { env: "react-client" };

import { callServer } from "./entry.rsc.ts" assert { env: "react-server" };
import type { ServerPayload } from "react-router/rsc";

const app = express();

app.use("/client", express.static("dist/client"));

app.use(
  createRequestListener(async (request) => {
    // rsc decoding (flight client) needs to be triggered inside fizz context (ssr)
    // so that `ReactDOM.preinit/preloadModule` (aka prepare destination) can hoist client reference scripts.
    let payload: Promise<ServerPayload>;
    function SsrRoot(props: { getPayload: () => Promise<ServerPayload> }) {
      payload ??= props.getPayload();
      return <RSCStaticRouter payload={React.use(payload) as any} />;
    }

    return routeRSCServerRequest(
      request,
      callServer,
      // hack to delay `decode`` inside `renderHTML`
      // https://github.com/remix-run/react-router/blob/692ce42b6c7d1e2d7ddc43213585154fc1dfeabc/packages/react-router/lib/rsc/server.ssr.tsx#L54-L65
      // @ts-ignore
      (body) => () => createFromReadableStream(body),
      async (payload) => {
        return await renderHTMLToReadableStream(
          React.createElement(SsrRoot, { getPayload: payload as any }),
          {
            bootstrapScriptContent: (
              callServer as unknown as { bootstrapScript: string }
            ).bootstrapScript,
          }
        );
      }
    );
  })
);

export default app;
