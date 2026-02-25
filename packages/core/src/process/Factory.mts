import path from "node:path";
import { ConstructorParams as ProcessConstructorParams } from "./Base.mjs";

type ConstructorParams = {
  autoloadPkg?: string;
  pathResolver?: (string) => string;
} & Record<string, unknown>;

export type CreateParams = Record<string, unknown>;

/**
 * Factory class for creating process instances
 */
export class Factory {
  private config: Record<string, unknown>;

  private autoloadPkg: string | undefined;

  private pathResolver: (string) => string;

  constructor({
    autoloadPkg = process.env.npm_package_name,
    pathResolver = import.meta.resolve,
    ...config
  }: ConstructorParams) {
    this.config = config;

    this.pathResolver = pathResolver;
    this.autoloadPkg = autoloadPkg ?? process.env.npm_package_name;
  }

  create = async (name: string, params: CreateParams = {}) => {
    //const { Process } = await import(`./${name}.mjs`);

    const { clientFactory, processes } = this.config;

    const setting = processes?.[name] ?? {};

    const config = {
      ...setting,
      ...params,
      clientFactory,
    };

    try {
      const { Process } = await import(
        this.pathResolver(
          config.classPath ??
            path.join(
              ...[this.autoloadPkg, "processes", `${name}.mjs`].filter(
                (v): v is Exclude<typeof v, undefined> => v !== undefined,
              ),
            ),
        )
      );

      const proc = new Process(config);

      await proc.init();

      return proc;
    } catch (cause) {
      throw new Error(`Failed to import Process`, { cause });
    }
  };
}
