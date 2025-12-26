import * as PromiseHelper from "@o3co/js.util.promise/Helper.mjs";
import { Command as Base } from "./BaseMultiTaskCommand.mjs";

/**
 */
export class Command extends Base {
  async doRun(params) {
    return await PromiseHelper.runSeq(
      new Array(this.numOfProcesses).fill(0),
      async (_) => {
        return await this.processFactory.run(this.processName, params);
      },
    );
  }
}
