import {
  Representer as Base,
  type RepresenterConstructionParams,
  type RepresenterParams,
  type Response,
} from "./Base.mjs";

/**
 */
export class Representer extends Base<
  RepresenterConstructionParams,
  RepresenterParams
> {
  doTransform(data: RepresenterParams): Response {
    return data;
  }
}
