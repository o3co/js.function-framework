import {
  BaseExecutor,
  type ConstructorParams as BaseConstructorParams,
  type TaskDef,
  type TaskRunParams,
} from "./Base.mjs";

export type ConstructorParams = {
  processes: TaskDef[];
} & BaseConstructorParams;

export type { TaskRunParams as ProcessRunParams };

export class BaseMultiTasksExecutor<
  TConstructorParams extends ConstructorParams,
> extends BaseExecutor<TConstructorParams> {
  protected processes: TaskDef[];

  constructor(params: TConstructorParams) {
    super(params);
    this.processes = params.processes;
  }
}
