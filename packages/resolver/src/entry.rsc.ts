"use server-entry";

import {
  decodeAction,
  decodeReply,
  loadServerAction,
  renderToReadableStream,
  // @ts-expect-error
} from "react-server-dom-parcel/server.edge";
import {
  type DecodeCallServerFunction,
  type DecodeFormActionFunction,
  matchRSCServerRequest,
} from "react-router/rsc";

import routes from "virtual:react-router/routes";

import "./entry.browser.tsx";

const decodeCallServer: DecodeCallServerFunction = async (actionId, reply) => {
  const args = await decodeReply(reply);
  const action = await loadServerAction(actionId);
  return action.bind(null, ...args);
};

const decodeFormAction: DecodeFormActionFunction = async (formData) => {
  return await decodeAction(formData);
};

export async function callServer(request: Request) {
  const match = await matchRSCServerRequest({
    decodeCallServer,
    decodeFormAction,
    request,
    routes,
  });

  return new Response(renderToReadableStream(match.payload), {
    status: match.statusCode,
    headers: match.headers,
  });
}
