import type { Factory as ClientFactory } from "../client/Factory.mjs";

export type ConstructorParams = {
  clientFactory: ClientFactory;
} & Record<string, unknown>;

/**
 */
export class Process<
  TRunParams extends object = Record<string, unknown>,
  TResult = unknown,
> {
  private _clientFactory: ClientFactory;

  protected params: Record<string, unknown>;

  constructor({ clientFactory, ...params }: ConstructorParams) {
    this._clientFactory = clientFactory;
    this.params = params;
  }

  async init(): Promise<void> {
    // Initialization logic can be implemented here
  }

  get clientFactory(): ClientFactory {
    return this._clientFactory;
  }

  /**
   *
   * @param params - Parameters for the process execution
   * @returns
   */
  run = async (params: TRunParams): Promise<TResult> => {
    return await this.doRun({
      ...(this.params ?? {}),
      ...params,
    });
  };

  /**
   * @returns {Promise<any>}
   */
  async doRun(_params: TRunParams): Promise<TResult> {
    throw new Error("doRun method must be implemented by subclass");
  }
}
