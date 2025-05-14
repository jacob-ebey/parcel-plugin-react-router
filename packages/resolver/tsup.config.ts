import * as fsp from "node:fs/promises";

import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/client-route-component-props.ts", "src/resolver.ts"],
  clean: true,
  format: ["cjs"],
  async onSuccess() {
    await Promise.all([
      fsp.copyFile("src/entry.browser.tsx", "./dist/entry.browser.tsx"),
      fsp.copyFile("src/entry.rsc.ts", "./dist/entry.rsc.ts"),
      fsp.copyFile("src/entry.ssr.tsx", "./dist/entry.ssr.tsx"),
    ]);
  },
});
