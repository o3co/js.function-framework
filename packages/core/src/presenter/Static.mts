import { BasePresenter, type ConstructionParams, type TransformParams } from "./Base.mjs";
import type { Response } from "../interfaces.mjs";

export type StaticConstructionParams = ConstructionParams & {
  return: string;
};

export class Presenter extends BasePresenter<StaticConstructionParams, TransformParams> {
  constructor(params: StaticConstructionParams) {
    super(params);
    if (!params.return) {
      throw new Error('Config "return" is not specified for static presenter');
    }
  }

  doTransform(_data: TransformParams): Response {
    return this.params.return;
  }
}
