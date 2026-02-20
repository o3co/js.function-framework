/**
 */
export class Representer {
  constructor(params = {}) {
    this.params = params;
  }

  transform = (params) => {
    return this.doTransform(params);
  };

  doTransform(_params) {
    //
    throw new Error("NotYetImpl");
  }

  transformError = (cause) => {
    return this.doTransformError(cause);
  };

  doTransformError(cause) {
    //
    throw cause;
  }
}
