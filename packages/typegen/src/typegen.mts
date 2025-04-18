import { Resolver } from "@parcel/plugin";
import { $ } from "execa";

export default new Resolver({
  async loadConfig({ options }) {
    if (options.mode === "development") {
      $`react-router typegen --watch`;
    }
  },
  resolve() {
    return undefined;
  },
});
