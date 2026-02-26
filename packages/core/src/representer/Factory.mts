import { deepMerge } from "@o3co/js.util.misc/types/object/Helper.mjs";
import type {
  Representer,
  ConstructionParams as RepresenterConstructionParams,
} from "./Base.mjs";
import defaultRepresenters from "./default.mjs";

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
    this.representers = deepMerge<
      Record<string, RepresenterConstructionParams>
    >(defaultRepresenters, representers ?? {});
    this.pathResolver = pathResolver;
  }

  create = async <TParams extends Partial<RepresenterConstructionParams>>(
    name: string,
    params: TParams,
  ): Promise<Representer> => {
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
      }) as Representer;

      return repr;
    } catch (cause) {
      throw new Error(`Failed to import representer`, { cause });
    }
  };
}
