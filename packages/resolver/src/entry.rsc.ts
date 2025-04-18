"use server-entry";

import {
  decodeReply,
  loadServerAction,
  renderToReadableStream,
  // @ts-expect-error
} from "react-server-dom-parcel/server.edge";
import {
  type DecodeCallServerFunction,
  matchServerRequest,
} from "react-router/server";

import routes from "virtual:react-router/routes";

import "./entry.client.tsx";

const decodeCallServer: DecodeCallServerFunction = async (actionId, reply) => {
  const args = await decodeReply(reply);
  const action = await loadServerAction(actionId);
  return action.bind(null, ...args);
};

export async function callServer(request: Request) {
  const match = await matchServerRequest({
    decodeCallServer,
    request,
    routes,
  });

  return new Response(renderToReadableStream(match.payload), {
    status: match.statusCode,
    headers: match.headers,
  });
}
