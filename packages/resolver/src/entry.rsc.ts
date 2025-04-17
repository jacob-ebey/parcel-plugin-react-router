"use server-entry";

// @ts-expect-error
import { renderToReadableStream } from "react-server-dom-parcel/server.edge";
import { matchServerRequest } from "react-router/server";

import routes from "virtual:react-router/routes";

import "./entry.client.tsx";

export async function callServer(request: Request) {
  const match = await matchServerRequest({ request, routes });

  return new Response(renderToReadableStream(match.payload), {
    status: match.statusCode,
    headers: match.headers,
  });
}
