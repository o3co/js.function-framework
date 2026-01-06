import fs from "node:fs/promises";
import path from "node:path";

/**
 */
export class Factory {
  constructor({ pathResolver = import.meta.resolve, ...params }) {
    this.params = params;
    this.pathResolver = pathResolver;
  }

  create = async (name, params = {}) => {
    const { processFactory, representerFactory, commands } = this.params;

    const setting = commands?.[name] ?? {};

    const { Command } = await (async () => {
      const classPath =
        setting.classPath ??
        path.join(
          ...[process.env.npm_package_name, "commands", `${name}.mjs`].filter(
            (v) => v,
          ),
        );
      try {
        return await import(this.pathResolver(classPath));
      } catch (error) {
        return await import(`./SingleTaskCommand.mjs`);
      }
    })();

    const command = new Command({
      ...setting,
      ...params,
      processFactory,
      representerFactory,
      name,
    });

    return command;
  };

  run = async (name, params) => {
    const command = await this.create(name);

    return await command.run(params);
  };
}
