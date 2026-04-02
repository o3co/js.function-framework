import { deepMerge } from "@o3co/js.util.misc/types/object/index.mjs";
import type {
  Presenter,
  PresenterFactory as IPresenterFactory,
} from "../interfaces.mjs";
import type { ConstructionParams as PresenterConstructionParams } from "./Base.mjs";
import defaultPresenters from "./default.mjs";

/**
 * Factory class for creating presenter instances
 */
export class Factory implements IPresenterFactory {
  presenters: Record<string, PresenterConstructionParams>;
  pathResolver: (path: string) => string;

  constructor({
    pathResolver = import.meta.resolve,
    presenters,
  }: {
    pathResolver?: (path: string) => string;
    presenters?: Record<string, PresenterConstructionParams>;
  }) {
    this.presenters = deepMerge<Record<string, PresenterConstructionParams>>(
      defaultPresenters,
      presenters ?? {},
    );
    this.pathResolver = pathResolver;
  }

  create = async <TParams extends Partial<PresenterConstructionParams>>(
    name: string,
    params: TParams,
  ): Promise<Presenter> => {
    const setting = this.presenters?.[name];

    if (!setting) {
      throw new Error(`Presenter ${name} is not defined`);
    }

    try {
      const mod = await import(this.pathResolver(setting.classPath));
      const PresenterClass = mod.Presenter ?? mod.Representer;

      if (!PresenterClass) {
        throw new Error(`Module does not export Presenter or Representer`);
      }

      const presenter = new PresenterClass({
        ...setting,
        ...params,
        name,
      }) as Presenter;

      return presenter;
    } catch (cause) {
      throw new Error(`Failed to import presenter`, { cause });
    }
  };
}
