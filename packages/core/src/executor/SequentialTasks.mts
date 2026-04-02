import * as PromiseHelper from "@o3co/js.util.misc/async/index.mjs";
import {
  BaseMultiTasksExecutor,
  type ConstructorParams as BaseConstructorParams,
  type ProcessRunParams,
} from "./BaseMultiTasks.mjs";

export type ConstructorParams = BaseConstructorParams;

export type { ProcessRunParams };

export class SequentialTasksExecutor extends BaseMultiTasksExecutor<ConstructorParams> {
  async doRun(params: ProcessRunParams): Promise<unknown> {
    return await PromiseHelper.runSeq(this.processes, async (process) => {
      return await (
        await this.taskFactory.create(process.process ?? this.executorName)
      ).run({ ...(process.params ?? {}), ...params });
    });
  }
}
