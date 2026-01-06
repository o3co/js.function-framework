import { deepMerge } from "@o3co/js.util.misc/merge.mjs";
import defaultConfig from "./default.mjs";
/**
 */
export class Factory {
  constructor({ pathResolver = import.meta.resolve, representers }) {
    this.representers = deepMerge(defaultConfig, representers);
    this.pathResolver = pathResolver;
  }

  create = async (name, params = {}) => {
    const setting = this.representers?.[name];

    if (!setting) {
      throw new Error(`Representer ${name} is not defined`);
    }

    const { Representer } = await (async () => {
      return await import(this.pathResolver(setting.classPath));
    })();

    const repr = new Representer({
      ...setting,
      ...params,
      name,
    });

    return repr;
  };
}
