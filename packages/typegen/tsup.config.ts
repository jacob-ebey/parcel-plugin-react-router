import * as fsp from "node:fs/promises";

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/typegen.mts"],
  clean: true,
  format: ["esm"],
});
