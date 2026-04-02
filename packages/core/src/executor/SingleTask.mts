import {
  BaseExecutor,
  type ConstructorParams as BaseConstructorParams,
  type TaskDef,
  type TaskRunParams,
} from "./Base.mjs";

export type ConstructorParams = BaseConstructorParams & TaskDef;

export class SingleTaskExecutor extends BaseExecutor<ConstructorParams> {
  protected params: TaskRunParams;
  protected process: string;

  constructor(params: ConstructorParams) {
    super(params);
    this.process = params.process ?? this.executorName;
    this.params = params.params ?? {};
  }

  async doRun(params: TaskRunParams): Promise<unknown> {
    return await (
      await this.taskFactory.create(this.process ?? this.executorName)
    ).run({ ...this.params, ...params });
  }
}
