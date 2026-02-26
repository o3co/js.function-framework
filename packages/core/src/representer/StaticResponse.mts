import {
  Representer as Base,
  type ConstructionParams,
  type Response,
  type TransformParams,
} from "./Base.mjs";

/**
 * Return Static Response
 */
export type StaticConstructionParams = ConstructionParams & {
  return: string;
};

export class Representer extends Base<
  StaticConstructionParams,
  TransformParams
> {
  constructor(params: StaticConstructionParams) {
    super(params);

    if (!params.return) {
      throw new Error(
        'Config "return" is not specified for static representer',
      );
    }
  }

  doTransform(_data: TransformParams): Response {
    return this.params.return;
  }
}
