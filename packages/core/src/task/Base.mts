import type { Task, ClientFactory } from "../interfaces.mjs";

export type ConstructorParams = {
  clientFactory: ClientFactory;
} & Record<string, unknown>;

export type TaskRunParams = Record<string, unknown>;

/**
 * Base class for all tasks.
 * Subclasses must override doRun() with business logic.
 */
export class BaseTask<
  TRunParams extends object = Record<string, unknown>,
  TResult = unknown,
> implements Task<TRunParams, TResult> {
  private _clientFactory: ClientFactory;

  protected params: Record<string, unknown>;

  constructor({ clientFactory, ...params }: ConstructorParams) {
    this._clientFactory = clientFactory;
    this.params = params;
  }

  async init(): Promise<void> {
    // Override for initialization logic
  }

  get clientFactory(): ClientFactory {
    return this._clientFactory;
  }

  run = async (params: TRunParams): Promise<TResult> => {
    return await this.doRun({
      ...(this.params ?? {}),
      ...params,
    });
  };

  async doRun(_params: TRunParams): Promise<TResult> {
    throw new Error("doRun method must be implemented by subclass");
  }
}

// Re-export for backward compat — consumer code exports { Process }
export { BaseTask as Task };
export { BaseTask as Process };
