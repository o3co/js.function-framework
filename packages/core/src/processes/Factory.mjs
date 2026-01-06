import path from "node:path";

/**
 */
export class Factory {
  constructor({ pathResolver = import.meta.resolve, ...config }) {
    this.config = config;

    this.pathResolver = pathResolver;
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
      this.pathResolver(
        config.classPath ??
          path.join(
            ...[
              process.env.npm_package_name,
              "processes",
              `${name}.mjs`,
            ].filter((v) => v),
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
