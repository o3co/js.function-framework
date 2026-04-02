import type {
  Executor,
  TaskFactory,
  PresenterFactory,
  Response,
} from "../interfaces.mjs";

export type ResponseConfig =
  | string
  | ({ type?: string } & Record<string, unknown>);

export type TaskDef = {
  process?: string;
  params?: TaskRunParams;
};

export type TaskRunParams = Record<string, unknown>;

export type ConstructorParams = {
  taskFactory: TaskFactory;
  presenterFactory: PresenterFactory;
  name: string;
  response?: ResponseConfig;
};

/**
 * Base class for all executors.
 * Orchestrates task execution and response presentation.
 */
export class BaseExecutor<TConstructorParams extends ConstructorParams>
  implements Executor<TaskRunParams, Response>
{
  protected taskFactory: TaskFactory;
  protected presenterFactory: PresenterFactory;
  protected executorName: string;
  protected responseType: string | null = null;
  protected responseParams: Record<string, unknown> = {};

  constructor({
    taskFactory,
    name,
    response,
    presenterFactory,
  }: TConstructorParams) {
    this.executorName = name;
    this.taskFactory = taskFactory;
    this.presenterFactory = presenterFactory;

    if (typeof response === "string") {
      this.responseType = response;
      this.responseParams = {};
    } else if (typeof response === "object") {
      const { type: resType = null, ...resParams } = response;
      this.responseType = resType;
      this.responseParams = resParams;
    }
  }

  run = async (params: TaskRunParams = {}): Promise<Response> => {
    const presenter = await this.presenterFactory.create(
      this.responseType ?? "pass",
      this.responseParams,
    );

    try {
      const ret = await this.doRun(params);
      return presenter.transform(ret);
    } catch (cause) {
      return presenter.transformError(cause);
    }
  };

  async doRun(_params: TaskRunParams): Promise<unknown> {
    throw new Error("doRun method must be implemented by subclass");
  }
}
