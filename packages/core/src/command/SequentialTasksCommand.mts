import * as PromiseHelper from "@o3co/js.util.misc/async/index.mjs";
import {
  Command as Base,
  type ConstructorParams as BaseConstructorParams,
  ProcessRunParams,
} from "./BaseMultiTasksCommand.mjs";

export type ConstructorParams = BaseConstructorParams;

export { ProcessRunParams };
/**
 */
export class Command extends Base<ConstructorParams> {
  async doRun(params: ProcessRunParams) {
    return await PromiseHelper.runSeq(this.processes, async (process) => {
      return await (
        await this.processFactory.create(process.process ?? this.commandName)
      ).run({ ...(process.params ?? {}), ...params });
    });
  }
}
