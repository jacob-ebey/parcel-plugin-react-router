"use client-entry";

import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import { getServerStream, ServerBrowserRouter } from "react-router";
import type { ServerPayload } from "react-router/server";
// @ts-expect-error
import { createFromReadableStream } from "react-server-dom-parcel/client";

createFromReadableStream(
  getServerStream(),
  { assets: "manifest" },
  {
    temporaryReferences: {
      clientId: () => <div>Client ID</div>,
    },
  }
).then((payload: ServerPayload) => {
  React.startTransition(() => {
    hydrateRoot(
      document,
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(ServerBrowserRouter, {
          decode: createFromReadableStream,
          payload,
        })
      )
    );
  });
});
