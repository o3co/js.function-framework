// export type DeepPartial<T> = {
//   [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
// };

export type RepresenterConstructionParams = {
  classPath: string;
};

export type RepresenterParams = any;

export type Response = any;

/**
 */
export class Representer<
  CP extends RepresenterConstructionParams,
  P extends RepresenterParams,
> {
  protected params: CP;

  //
  constructor(params: CP = {} as CP) {
    this.params = params;
  }

  transform = (params: P): Response => {
    return this.doTransform(params);
  };

  doTransform(_params: P): Response {
    //
    throw new Error("NotYetImpl");
  }

  transformError = (cause: Error): Response => {
    return this.doTransformError(cause);
  };

  doTransformError(cause: Error): Response {
    //
    throw cause;
  }
}
