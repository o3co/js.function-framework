// export type DeepPartial<T> = {
//   [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
// };

export type ConstructionParams = {
  classPath: string;
};

export type TransformParams = unknown;

export type Response = unknown;

/**
 */
export class Representer<
  TConstructorParams extends ConstructionParams = ConstructionParams,
  TTransformParams extends TransformParams = TransformParams,
> {
  protected params: TConstructorParams;

  //
  constructor(params: TConstructorParams = {} as TConstructorParams) {
    this.params = params;
  }

  transform = (params: TTransformParams): Response => {
    return this.doTransform(params);
  };

  doTransform(_params: TTransformParams): Response {
    //
    throw new Error("NotYetImpl");
  }

  transformError = (cause: unknown): Response => {
    return this.doTransformError(cause);
  };

  doTransformError(cause: unknown): Response {
    //
    throw cause;
  }
}
