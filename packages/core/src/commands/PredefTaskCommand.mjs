import * as PromiseHelper from "@o3co/js.util.promise/Helper.mjs";
import { Command as Base } from "./Base.mjs";

export class Command extends Base {
  async doRun(params) {
    const { asyncMode = "sequence" } = this.params;

    switch (asyncMode) {
      case "parallel":
        return await this.doRunParallel(params);
      default:
        return await this.doRunSeq(params);
    }
  }

  doRunSeq = async (params) => {
    const { processes } = this.params;

    return PromiseHelper.runSeq(processes, async (process) => {
      return await this.doRunProcess(process, params);
    });
  };

  doRunParallel = async (params) => {
    const { processes } = this.params;

    return PromiseHelper.runParallel(
      processes,
      async (process) => {
        return await this.doRunProcess(process, params);
      },
      {
        limit: this.params.parallelLimit ?? 1,
      }
    );
  };

  doRunProcess = async (processParams, givenParams) => {
    const { process: processName, params: defaultParams } = processParams;

    return await this.processFactory.run(processName, {
      ...defaultParams,
      ...givenParams,
    });
  };
}
