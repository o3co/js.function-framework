import { parseArgs } from "node:util";

import type { Factory as CommandFactory } from "@o3co/js.function-framework.core/command/Factory.mjs";

export type ConstructorParams = {
  name: string;
  commandFactory: CommandFactory;
};

/**
 */
export class Command {
  protected name: string;

  protected _commandFactory: CommandFactory;

  constructor(params: ConstructorParams) {
    const { commandFactory } = params;

    this.name = params.name;
    this._commandFactory = commandFactory;
  }

  get commandFactory(): CommandFactory {
    return this._commandFactory;
  }

  runCommand = async (
    name,
    runParams?: Record<string, unknown>,
    constructionParams?: Record<string, unknown>,
  ) => {
    const { format = null } = constructionParams ?? {};

    return await (
      await this.commandFactory.create(name, constructionParams)
    ).run(runParams);
  };

  run = async () => {
    const { values = {}, positionals = [] } = this.parseInput();

    return await this.doRun(values, positionals);
  };

  /**
   *
   * @param _options
   * @param _positionals
   */
  protected async doRun(
    _options: Record<string, unknown>,
    _positionals: string[],
  ) {
    throw new Error("Not implemented");
  }

  /**
   * Override to provide options for parsing input
   */
  protected inputOptions(): Record<string, any> | null {
    return null;
  }

  private parseInput() {
    const options = this.inputOptions();

    if (options) {
      parseArgs({
        ...options,
        strict: true,
        args: process.argv.slice(2),
        allowPositionals: true,
      });
      return parseArgs({
        ...options,
        strict: true,
        args: process.argv.slice(2),
        allowPositionals: true,
      });
    }

    return { values: {}, positionals: [] };
  }
}
