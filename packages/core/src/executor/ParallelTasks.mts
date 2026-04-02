import * as PromiseHelper from "@o3co/js.util.misc/async/index.mjs";
import {
  BaseMultiTasksExecutor,
  type ConstructorParams as BaseConstructorParams,
  type ProcessRunParams,
} from "./BaseMultiTasks.mjs";

export type ConstructorParams = BaseConstructorParams & {
  numOfThreads?: number;
};

export class ParallelTasksExecutor extends BaseMultiTasksExecutor<ConstructorParams> {
  protected numOfThreads: number;

  constructor(params: ConstructorParams) {
    super(params);
    this.numOfThreads = params.numOfThreads ?? 5;
  }

  async doRun(params: ProcessRunParams): Promise<unknown> {
    return await PromiseHelper.runParallel(
      this.processes,
      async (process) => {
        return await (
          await this.taskFactory.create(process.process ?? this.executorName)
        ).run({ ...(process.params ?? {}), ...params });
      },
      {
        concurrency: this.numOfThreads,
        stopOnFailure: true,
      },
    );
  }
}
