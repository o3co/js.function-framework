import { BasePresenter, type ConstructionParams } from "./Base.mjs";
import type { Response } from "../interfaces.mjs";

export type JsonConstructionParams = ConstructionParams & {
  pretty?: boolean;
};

type JsonParams = unknown;

export class Presenter extends BasePresenter<JsonConstructionParams, JsonParams> {
  doTransform(data: JsonParams): Response {
    return JSON.stringify(data, null, this.params.pretty ? 2 : undefined);
  }
}
