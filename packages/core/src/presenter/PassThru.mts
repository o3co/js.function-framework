import { BasePresenter, type ConstructionParams, type TransformParams } from "./Base.mjs";
import type { Response } from "../interfaces.mjs";

export class Presenter extends BasePresenter<ConstructionParams, TransformParams> {
  doTransform(data: TransformParams): Response {
    return data;
  }
}
