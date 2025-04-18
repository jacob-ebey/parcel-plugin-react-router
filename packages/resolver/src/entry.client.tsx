"use client-entry";

import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import {
  createCallServer,
  getServerStream,
  ServerBrowserRouter,
} from "react-router";
import type { ServerPayload } from "react-router/server";
import {
  createFromReadableStream,
  encodeReply,
  setServerCallback,
  // @ts-expect-error
} from "react-server-dom-parcel/client";

const callServer = createCallServer({
  decode: (body) => createFromReadableStream(body, { callServer }),
  encodeAction: (args) => encodeReply(args),
});

setServerCallback(callServer);

createFromReadableStream(getServerStream(), { assets: "manifest" }).then(
  (payload: ServerPayload) => {
    React.startTransition(() => {
      hydrateRoot(
        document,
        React.createElement(
          React.StrictMode,
          null,
          React.createElement(ServerBrowserRouter, {
            decode: (body) => createFromReadableStream(body),
            payload,
          })
        )
      );
    });
  }
);
