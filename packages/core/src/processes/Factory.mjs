import path from "node:path";

/**
 */
export class Factory {
  constructor(config) {
    this.config = config;
  }

  create = async (name, params = {}) => {
    //const { Process } = await import(`./${name}.mjs`);

    const { clientFactory, processes } = this.config;

    const config = {
      ...(processes?.[name] ?? {}),
      ...params,
      clientFactory,
    };

    const { Process } = await import(
      config.className ??
        path.join(
          ...[process.env.npm_package_name, "processes", `${name}.mjs`].filter(
            (v) => v,
          ),
        )
    );

    const proc = new Process(config);

    await proc.init();

    return proc;
  };

  run = async (name, params) => {
    const task = await this.create(name);

    return await task.run(params);
  };
}
