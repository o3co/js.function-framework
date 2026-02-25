import {
  Representer as Base,
  type RepresenterConstructionParams,
  type RepresenterParams,
  type Response,
} from "./Base.mjs";

/**
 * Return Static Response
 */
export type StaticConstructionParams = RepresenterConstructionParams & {
  return: string;
};

export class Representer extends Base<
  StaticConstructionParams,
  RepresenterParams
> {
  constructor(params: StaticConstructionParams) {
    if (!params.return) {
      throw new Error(
        'Config "return" is not specified for static representer',
      );
    }
    super(params);
  }

  doTransform(_data: RepresenterParams): Response {
    return this.params.return;
  }
}
