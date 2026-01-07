import path from "node:path";
/**
 *
 * new Factory(config.get('cli'))
 */
export class Factory {
  constructor({
    commandFactory,
    commands,
    pathResolver = import.meta.resolve,
    autoloadPkg = process.env.npm_package_name,
  }) {
    this.commands = commands;
    this.commandFactory = commandFactory;
    this.pathResolver = pathResolver;
    this.autoloadPkg = autoloadPkg;
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
          this.autoloadPkg,
          "cli",
          "commands",
          `${name}.mjs`,
        ),
      } = this.commands?.[name] ?? {};

      try {
        const { Command } = await import(this.pathResolver(classPath));

        return Command;
      } catch (_cause) {
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
