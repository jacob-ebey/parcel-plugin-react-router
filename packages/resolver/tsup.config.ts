import * as fsp from "node:fs/promises";

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/resolver.mts"],
  clean: true,
  format: ["esm"],
  async onSuccess() {
    await Promise.all([
      fsp.copyFile("src/entry.client.tsx", "./dist/entry.client.tsx"),
      fsp.copyFile("src/entry.rsc.ts", "./dist/entry.rsc.ts"),
      fsp.copyFile("src/entry.server.tsx", "./dist/entry.server.tsx"),
    ]);
  },
});
