import {
  Representer as Base,
  type RepresenterConstructionParams,
  RepresenterParams,
  Response,
} from "./Base.mjs";
import type { HttpResponse } from "./HttpResponse.mts";
import type { JsonParams } from "./JsonResponse.mts";

export type HttpJsonConstructionParams = RepresenterConstructionParams & {
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

  doTransformError(cause: Error): HttpResponse {
    return {
      statusCode: 500,
      body: JSON.stringify({ code: 500, error: cause.message }),
    };
  }
}
