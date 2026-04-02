import { deepMerge } from "@o3co/js.util.misc/types/object/index.mjs";
import type {
  Presenter,
  PresenterFactory as IPresenterFactory,
} from "../interfaces.mjs";
import type { ConstructorParams as PresenterConstructorParams } from "./Base.mjs";
import defaultPresenters from "./default.mjs";

export type ConstructorParams = {
  pathResolver?: (path: string) => string;
  presenters?: Record<string, PresenterConstructorParams>;
};

/**
 * Factory class for creating presenter instances
 */
export class Factory implements IPresenterFactory {
  presenters: Record<string, PresenterConstructorParams>;
  pathResolver: (path: string) => string;

  constructor({
    pathResolver = import.meta.resolve,
    presenters = {},
  }: ConstructorParams) {
    this.presenters = deepMerge<Record<string, PresenterConstructorParams>>(
      defaultPresenters,
      presenters,
    );
    this.pathResolver = pathResolver;
  }

  create = async <TParams extends Partial<PresenterConstructorParams>>(
    name: string,
    params: TParams = {} as TParams,
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
      throw new Error(`Failed to import presenter "${name}"`, { cause });
    }
  };
}
