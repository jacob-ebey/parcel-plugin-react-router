import * as fsp from "node:fs/promises";

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/client-route-component-props.ts", "src/transformer.ts"],
  clean: true,
  format: ["cjs"],
  external: ["./client-route-component-props.js"],
});
