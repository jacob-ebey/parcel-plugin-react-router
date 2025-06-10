import { createRequestListener } from "@mjackson/node-fetch-server";
import express from "express";

import reactRouterRequestHandler from "virtual:react-router/request-handler";

const app = express();

app.use(express.static("public"));
app.use("/client", express.static("dist/request-handler/client"));

app.get("/.well-known/appspecific/com.chrome.devtools.json", (_, res) => {
  res.status(404);
  res.send("Not Found");
});

app.use(createRequestListener(reactRouterRequestHandler));

app.listen(3000);
console.log("Server listening on port 3000 (http://localhost:3000)");

export default app;
