import type { Factory as ProcessFactory } from "../process/Factory.mjs";
import type { Factory as RepresenterFactory } from "../representer/Factory.mjs";

export type ResponseConfig =
  | string
  | ({ type?: string } & Record<string, unknown>);

export type ConstructorParams = {
  processFactory: ProcessFactory;
  representerFactory: RepresenterFactory;
  name: string;
  response?: ResponseConfig;
};

export type ProcessDef = {
  process: string;
  params: ProcessRunParams;
};

export type ProcessRunParams = Record<string, unknown>;

/**
 */
export class Command<TConstructorParams extends ConstructorParams> {
  protected processFactory: ProcessFactory;

  protected representerFactory: RepresenterFactory;

  protected commandName: string;

  protected responseType: string | null = null;

  protected responseParams: Record<string, unknown> = {};

  constructor({
    processFactory,
    name,
    response,
    representerFactory,
  }: TConstructorParams) {
    this.commandName = name;
    this.processFactory = processFactory;
    this.representerFactory = representerFactory;

    if (typeof response === "string") {
      this.responseType = response;
      this.responseParams = {};
    } else if (typeof response === "object") {
      const { type: resType = null, ...resParams } = response;

      this.responseType = resType;
      this.responseParams = resParams;
    }
  }

  /**
   * Final
   */
  run = async (params: ProcessRunParams = {}): Promise<any> => {
    const representer = await this.representerFactory.create(
      this.responseType ?? "pass",
      this.responseParams,
    );

    try {
      const ret = await this.doRun(params);

      return representer.transform(ret);
    } catch (cause) {
      return representer.transformError(cause);
    }
  };

  /**
   * Override in subclass
   * @returns {Promise<unknown>}
   */
  async doRun(_params: ProcessRunParams): Promise<unknown> {
    // Override Here
    throw new Error("doRun method must be implemented by subclass");
  }
}
