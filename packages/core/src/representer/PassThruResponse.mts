import {
  Representer as Base,
  type ConstructionParams,
  type Response,
  type TransformParams,
} from "./Base.mjs";

/**
 */
export class Representer extends Base<ConstructionParams, TransformParams> {
  doTransform(data: TransformParams): Response {
    return data;
  }
}
