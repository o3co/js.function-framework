import { BasePresenter, type ConstructorParams, type TransformParams } from "./Base.mjs";
import type { Response } from "../interfaces.mjs";

export class Presenter extends BasePresenter<ConstructorParams, TransformParams> {
  doTransform(data: TransformParams): Response {
    return data;
  }
}
