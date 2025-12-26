import { Command as Base } from "./Base.mjs";

/**
 *
 */
export class Command extends Base {
  async doRun(params) {
    return await this.processFactory.run(this.processName, params);
  }
}
