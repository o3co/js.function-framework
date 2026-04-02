import path from "node:path";

import type { Factory as ExecutorFactory } from "@o3co/js.function-framework.core/executor/Factory.mjs";

export type CommandConfig = {
  classPath?: string;
};

export type ConstructorParams = {
  executorFactory: ExecutorFactory;
  commands: Record<string, CommandConfig>;
  pathResolver?: (path: string) => string;
  autoloadPkg?: string;
};

/**
 *
 * new Factory(config.get('cli'))
 */
export class Factory {
  protected commands: Record<string, CommandConfig>;
  protected pathResolver: (path: string) => string;
  protected autoloadPkg: string;
  protected executorFactory: ExecutorFactory;

  constructor({
    executorFactory,
    commands,
    pathResolver = import.meta.resolve,
    autoloadPkg = process.env.npm_package_name,
  }: ConstructorParams) {
    this.commands = commands;
    this.executorFactory = executorFactory;
    this.pathResolver = pathResolver ?? import.meta.resolve;
    const tmpPkg = autoloadPkg ?? process.env.npm_package_name;
    if (!tmpPkg) {
      throw new Error(
        `Failed to resolve "process.env.npm_package_name" for autoloading commands`,
      );
    }
    this.autoloadPkg = tmpPkg;
  }

  /**
   * Create from
   *  1. config "cli.commands.{name}.mjs"
   *  2. {app_package_name}/cli/commands/Echo.mjs
   *  (3. Fallback with NoArgument)
   *
   */
  create = async (name: string, params: Record<string, unknown> = {}) => {
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
        name,
        executorFactory: this.executorFactory,
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
