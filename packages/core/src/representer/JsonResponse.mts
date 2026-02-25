import {
  Representer as Base,
  type RepresenterConstructionParams,
  type RepresenterParams,
  type Response,
} from "./Base.mjs";

export type JsonConstructionParams = RepresenterConstructionParams & {
  pretty?: boolean;
};

export type JsonParams = RepresenterParams;

/**
 * Return JSON String
 */
export class Representer extends Base<JsonConstructionParams, JsonParams> {
  doTransform(data: JsonParams): Response {
    return JSON.stringify(data, null, this.params.pretty ? 2 : undefined);
  }
}
