import {
  Representer as Base,
  type ConstructionParams,
  type Response,
  type TransformParams,
} from "./Base.mjs";

export type JsonConstructionParams = ConstructionParams & {
  pretty?: boolean;
};

export type JsonParams = TransformParams;

/**
 * Return JSON String
 */
export class Representer extends Base<JsonConstructionParams, JsonParams> {
  doTransform(data: JsonParams): Response {
    return JSON.stringify(data, null, this.params.pretty ? 2 : undefined);
  }
}
