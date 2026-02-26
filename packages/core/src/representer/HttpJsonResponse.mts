import { Representer as Base, type ConstructionParams } from "./Base.mjs";
import type { HttpResponse } from "./HttpResponse.mts";
import type { JsonParams } from "./JsonResponse.mts";

export type HttpJsonConstructionParams = ConstructionParams & {
  pretty?: boolean;
};

export type HttpJsonParams = JsonParams & {};

/**
 */
export class Representer extends Base<
  HttpJsonConstructionParams,
  HttpJsonParams
> {
  doTransform(body: HttpJsonParams): HttpResponse {
    return {
      statusCode: 200,
      body: JSON.stringify(body, null, this.params.pretty ? 2 : undefined),
    };
  }

  doTransformError(cause: Representer): HttpResponse {
    if (cause instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ code: 500, error: cause.message }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        code: 500,
        //error: String(cause),
      }),
    };
  }
}
