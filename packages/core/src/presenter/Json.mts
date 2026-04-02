import { BasePresenter, type ConstructorParams } from "./Base.mjs";
import type { Response } from "../interfaces.mjs";

export type JsonConstructorParams = ConstructorParams & {
  pretty?: boolean;
};

type JsonParams = unknown;

export class Presenter extends BasePresenter<JsonConstructorParams, JsonParams> {
  doTransform(data: JsonParams): Response {
    return JSON.stringify(data, null, this.params.pretty ? 2 : undefined);
  }
}
