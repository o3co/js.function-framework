import { Command as Base } from "./Base.mjs";

/**
 */
export class Command extends Base {
  inputOptions() {
    return {};
  }

  async doRun(_, positionals) {
    const [_command, ..._message] = positionals;

    return await this.runCommand(_command);
  }
}
