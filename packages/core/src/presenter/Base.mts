import type { Presenter, Response } from "../interfaces.mjs";

export type ConstructionParams = {
  classPath: string;
};

export type TransformParams = unknown;

/**
 * Base class for all presenters.
 * Subclasses must override doTransform() and optionally doTransformError().
 */
export class BasePresenter<
  TConstructorParams extends ConstructionParams = ConstructionParams,
  TTransformParams extends TransformParams = TransformParams,
> implements Presenter<TTransformParams, Response> {
  protected params: TConstructorParams;

  constructor(params: TConstructorParams = {} as TConstructorParams) {
    this.params = params;
  }

  transform = (params: TTransformParams): Response => {
    return this.doTransform(params);
  };

  doTransform(_params: TTransformParams): Response {
    throw new Error("doTransform must be implemented by subclass");
  }

  transformError = (cause: unknown): Response => {
    return this.doTransformError(cause);
  };

  doTransformError(cause: unknown): Response {
    throw cause;
  }
}

// Re-export for backward compat
export { BasePresenter as Presenter };
export { BasePresenter as Representer };
