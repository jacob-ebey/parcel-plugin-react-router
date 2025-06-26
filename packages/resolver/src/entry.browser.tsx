"use client-entry";

import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import {
  type unstable_ServerPayload as ServerPayload,
  unstable_createCallServer as createCallServer,
  unstable_getServerStream as getServerStream,
  unstable_RSCHydratedRouter as RSCHydratedRouter,
} from "react-router";
import {
  createFromReadableStream,
  encodeReply,
  setServerCallback,
  // @ts-expect-error
} from "react-server-dom-parcel/client";

setServerCallback(
  createCallServer({
    createFromReadableStream,
    encodeReply,
  }),
);

createFromReadableStream(getServerStream()).then((payload: ServerPayload) => {
  React.startTransition(() => {
    hydrateRoot(
      document,
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(RSCHydratedRouter, {
          createFromReadableStream,
          payload,
        }),
      ),
    );
  });
});
