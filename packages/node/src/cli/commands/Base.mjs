import { parseArgs } from "node:util";

/**
 */
export class Command {
  constructor(params) {
    this.params = params;
  }

  get commandFactory() {
    return this.params.commandFactory;
  }

  runCommand = async (name, params) => {
    return await (
      await this.commandFactory.create(name, {
        ...this.commandParams,
      })
    ).run(params);
  };

  run = async ({ representer = "json", ...defaults } = {}) => {
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
    return {};
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
