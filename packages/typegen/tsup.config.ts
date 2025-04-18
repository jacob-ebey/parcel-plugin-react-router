import * as fsp from "node:fs/promises";

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/typegen.ts"],
  clean: true,
  format: ["cjs"],
});
