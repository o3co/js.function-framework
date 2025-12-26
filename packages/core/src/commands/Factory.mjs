import fs from "node:fs/promises";

/**
 */
export class Factory {
  constructor(params) {
    this.params = params;
  }

  create = async (name, params = {}) => {
    const { processFactory, representerFactory, commands } = this.params;

    const setting = commands?.[name] ?? {};

    const { Command } = await (async () => {
      const classPath = setting.className
        ? `./${setting.className}.mjs`
        : `./${name}.mjs`;

      try {
        await fs.access(new URL(classPath, import.meta.url));

        return await import(classPath);
      } catch (error) {
        console.error(error);

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
