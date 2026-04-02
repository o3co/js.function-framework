import { parseArgs } from "node:util";

import type { Factory as ExecutorFactory } from "@o3co/js.function-framework.core/executor/Factory.mjs";

export type ConstructorParams = {
  name: string;
  executorFactory: ExecutorFactory;
};

/**
 */
export class Command<DoRunOptions extends {} = Record<string, unknown>> {
  protected name: string;

  protected _executorFactory: ExecutorFactory;

  constructor(params: ConstructorParams) {
    const { executorFactory } = params;

    this.name = params.name;
    this._executorFactory = executorFactory;
  }

  get executorFactory(): ExecutorFactory {
    return this._executorFactory;
  }

  runCommand = async (
    name: string,
    runParams?: Record<string, unknown>,
    constructionParams?: Record<string, unknown>,
  ) => {
    const { format = null } = constructionParams ?? {};

    return await (
      await this.executorFactory.create(name, constructionParams)
    ).run(runParams);
  };

  run = async () => {
    const { values = {}, positionals = [] } = this.parseInput();

    return await this.doRun(values as DoRunOptions, positionals);
  };

  /**
   *
   * @param _options
   * @param _positionals
   */
  protected async doRun(_options: DoRunOptions, _positionals: string[]): Promise<unknown> {
    throw new Error("Not implemented");
  }

  /**
   * Override to provide options for parsing input
   */
  protected inputOptions(): Record<string, unknown> | null {
    return null;
  }

  private parseInput(): {
    values: {};
    positionals: string[];
  } {
    const options = this.inputOptions();

    if (options) {
      const { values, positionals } = parseArgs({
        ...options,
        strict: true,
        args: process.argv.slice(2),
        allowPositionals: true,
      });

      return { values, positionals };
    }

    return { values: {}, positionals: [] };
  }
}
