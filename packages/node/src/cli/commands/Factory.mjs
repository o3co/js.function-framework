import path from "node:path";
/**
 *
 * new Factory(config.get('cli'))
 */
export class Factory {
  constructor({ commandFactory, commands }) {
    this.commands = commands;
    this.commandFactory = commandFactory;
  }

  /**
   * Create from
   *  1. config "cli.commands.{name}.mjs"
   *  2. {app_package_name}/cli/commands/Echo.mjs
   *  (3. Fallback with NoArgument)
   *
   */
  create = async (name, params = {}) => {
    const Command = await (async () => {
      const {
        classPath = path.join(
          process.env.npm_package_name,
          "cli",
          "commands",
          `${name}.mjs`
        ),
      } = this.commands?.[name] ?? {};

      try {
        const { Command } = await import(classPath);

        return Command;
      } catch (cause) {
        //throw new Error(`Failed to import Command: ${classPath}`, { cause });
        //
        const { Command } = await import("./NoArgument.mjs");
        return Command;
      }
    })();

    try {
      return new Command({
        ...params,
        //Command: name,
        commandFactory: this.commandFactory,
      });
    } catch (cause) {
      throw new Error("Failed to create Command", { cause });
    }
  };

  run = async (name) => {
    const command = await this.create(name);

    return await command.run();
  };
}
