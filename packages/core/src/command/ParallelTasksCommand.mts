import * as PromiseHelper from "@o3co/js.util.promise/Helper.mjs";

import {
  Command as Base,
  type ConstructorParams as BaseConstructorParams,
  type ProcessRunParams,
} from "./BaseMultiTasksCommand.mjs";

export type ConstructorParams = BaseConstructorParams & {
  numOfThreads?: number;
};

/**
 */
export class Command extends Base<ConstructorParams> {
  protected numOfThreads: number;

  /**
   */
  constructor(params: ConstructorParams) {
    super(params);
    this.numOfThreads = params.numOfThreads ?? 5;
  }

  async doRun(params: ProcessRunParams): Promise<any> {
    return await PromiseHelper.runParallel<any, any>(
      this.processes,
      async (process) => {
        return await (
          await this.processFactory.create(process.process ?? this.commandName)
        ).run({ ...(process.params ?? {}), ...params });
      },
      {
        limit: this.numOfThreads,
        stopOnFailure: true,
      },
    );
  }
}
