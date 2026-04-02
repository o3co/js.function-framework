import { BasePresenter, type ConstructorParams, type TransformParams } from "./Base.mjs";
import type { Response } from "../interfaces.mjs";

export type StaticConstructorParams = ConstructorParams & {
  return: string;
};

export class Presenter extends BasePresenter<StaticConstructorParams, TransformParams> {
  constructor(params: StaticConstructorParams) {
    super(params);
    if (!params.return) {
      throw new Error('Config "return" is not specified for static presenter');
    }
  }

  doTransform(_data: TransformParams): Response {
    return this.params.return;
  }
}
