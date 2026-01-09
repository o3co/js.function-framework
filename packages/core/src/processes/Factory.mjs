import path from "node:path";

/**
 */
export class Factory {
  constructor({
    autoloadPkg = process.env.npm_package_name,
    pathResolver = import.meta.resolve,
    ...config
  }) {
    this.config = config;

    this.pathResolver = pathResolver;
    this.autoloadPkg = autoloadPkg ?? process.env.npm_package_name;
  }

  create = async (name, params = {}) => {
    //const { Process } = await import(`./${name}.mjs`);

    const { clientFactory, processes } = this.config;

    const setting = processes?.[name] ?? {};
    const config = {
      ...setting,
      defaultParams: setting.params ?? {},
      ...params,
      clientFactory,
    };

    try {
      const { Process } = await import(
        this.pathResolver(
          config.classPath ??
            path.join(
              ...[this.autoloadPkg, "processes", `${name}.mjs`].filter(
                (v) => v,
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

  run = async (name, params) => {
    const task = await this.create(name);

    return await task.run(params);
  };
}
