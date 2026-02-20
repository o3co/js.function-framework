import { parseArgs } from "node:util";

/**
 */
export class Command {
  constructor(params) {
    const { commandFactory, ...commandParams } = params;

    this._commandFactory = commandFactory;
    this.defaultCommandParams = commandParams;
  }

  get commandFactory() {
    return this._commandFactory;
  }

  runCommand = async (name, params) => {
    return await (
      await this.commandFactory.create(name, {
        ...this.defaultCommandParams,
        ...Object.fromEntries(
          Object.entries(this.commandParams).filter(([_, v]) => v),
        ),
      })
    ).run(params);
  };

  run = async ({ representer, ...defaults } = {}) => {
    const { values = {}, positionals = [] } = this.parseInput();

    this.commandParams = {
      representer: values.format ?? representer,
    };

    return await this.doRun({ ...defaults, ...values }, positionals);
  };

  async doRun(_params) {}

  /**
   */
  inputOptions() {
    return null;
  }

  parseInput() {
    const options = this.inputOptions();

    if (options) {
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
