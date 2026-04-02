import { BasePresenter, type ConstructorParams } from "./Base.mjs";
import type { HttpResponse } from "./Http.mjs";

export type HttpJsonConstructorParams = ConstructorParams & {
  pretty?: boolean;
};

type HttpJsonParams = unknown;

export class Presenter extends BasePresenter<HttpJsonConstructorParams, HttpJsonParams> {
  doTransform(body: HttpJsonParams): HttpResponse {
    return {
      statusCode: 200,
      body: JSON.stringify(body, null, this.params.pretty ? 2 : undefined),
    };
  }

  doTransformError(cause: unknown): HttpResponse {
    if (cause instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ code: 500, error: cause.message }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ code: 500 }),
    };
  }
}
