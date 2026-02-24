import { deepMerge } from "@o3co/js.util.misc/merge.mjs";
import type { RepresenterConstructionParams } from "./Base.mjs";
import defaultConfig from "./default.mjs";
//import type { Partial } from "@o3co/js.util.type/Partial.mts";

/**
 */
export class Factory {
  representers: Record<string, RepresenterConstructionParams>;
  pathResolver: (path: string) => string;

  constructor({
    pathResolver = import.meta.resolve,
    representers,
  }: {
    pathResolver?: (path: string) => string;
    representers?: Record<string, RepresenterConstructionParams>;
  }) {
    this.representers = deepMerge(defaultConfig, representers) as Record<
      string,
      RepresenterConstructionParams
    >;
    this.pathResolver = pathResolver;
  }

  create = async <CP extends Partial<RepresenterConstructionParams>>(
    name: string,
    params: CP,
  ): Promise<any> => {
    const setting = this.representers?.[name];

    if (!setting) {
      throw new Error(`Representer ${name} is not defined`);
    }

    try {
      const { Representer } = await (async () => {
        return await import(this.pathResolver(setting.classPath));
      })();

      const repr = new Representer({
        ...setting,
        ...params,
        name,
      });

      return repr;
    } catch (cause) {
      throw new Error(`Failed to import representer`, { cause });
    }
  };
}
