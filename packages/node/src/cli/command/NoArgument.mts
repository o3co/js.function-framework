import { Command as Base } from "./Base.mjs";

/**
 */
export class Command extends Base {
  protected inputOptions() {
    return null;
  }

  async doRun(_params: Record<string, unknown>, positionals: string[]) {
    const [command, ..._positionals] = positionals;

    return await this.runCommand(this.name, {});
  }
}
