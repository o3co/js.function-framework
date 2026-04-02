import { BasePresenter, type ConstructorParams } from "./Base.mjs";
import type { Response } from "../interfaces.mjs";

export type HttpConstructorParams = ConstructorParams & Record<string, unknown>;

export type HttpParams = unknown;

export type HttpResponse = Response & {
  statusCode: number;
  body: unknown;
  headers?: Record<string, string>;
};

export class Presenter extends BasePresenter<HttpConstructorParams, HttpParams> {
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
      body: "Internal Server Error",
    };
  }
}
