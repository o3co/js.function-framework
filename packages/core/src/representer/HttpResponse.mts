import {
  Representer as Base,
  type RepresenterConstructionParams,
  type RepresenterParams,
  type Response,
} from "./Base.mjs";

export type HttpConstructionParams = RepresenterConstructionParams;

export type HttpParams = RepresenterParams;

/**
 */
export type HttpResponse = Response & {
  statusCode: number;
  body: unknown;
};

export class Representer extends Base<HttpConstructionParams, HttpParams> {
  doTransform(body: HttpParams): HttpResponse {
    return {
      statusCode: 200,
      body,
    };
  }

  doTransformError(cause: Error): HttpResponse {
    return {
      statusCode: 500,
      body: cause.message,
    };
  }
}
