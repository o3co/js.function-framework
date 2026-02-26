import {
  Representer as Base,
  type ConstructionParams,
  type Response,
  type TransformParams,
} from "./Base.mjs";

export type HttpConstructionParams = ConstructionParams;

export type HttpParams = TransformParams;

/**
 */
export type HttpResponse = Response & {
  statusCode: number;
  body: unknown;
  headers?: Record<string, string>;
};

export class Representer extends Base<HttpConstructionParams, HttpParams> {
  doTransform(body: HttpParams): HttpResponse {
    return {
      statusCode: 200,
      body,
    };
  }

  doTransformError(cause: unknown): HttpResponse {
    if (cause instanceof Error) {
      return {
        statusCode: 500,
        body: cause.message,
      };
    }
    return {
      statusCode: 500,
      //body: String(cause),
      body: "Internal Server Error",
    };
  }
}
