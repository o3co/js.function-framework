import * as PromiseHelper from "@o3co/js.util.promise/Helper.mjs";
import { Command as Base } from "./BaseMultiTaskCommand.mjs";

/**
 */
export class Command extends Base {
  /**
   */
  constructor({ parallelLimit = 5, ...props }) {
    super(props);

    this.parallelLimit = parallelLimit;
  }

  async doRun(params) {
    return await PromiseHelper.runParallel(
      new Array(this.numOfProcesses).fill(0),
      async (_) => {
        return await this.processFactory.run(this.processName, params);
      },
      {
        limit: this.parallelLimit ?? 5,
      },
    );
  }
}
