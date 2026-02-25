import {
  Command as Base,
  type ConstructorParams as BaseConstructorParams,
  type ProcessDef,
} from "./BaseCommand.mjs";

export type ConstructorParams = {
  processes: ProcessDef[];
} & BaseConstructorParams;

export { ProcessRunParams } from "./BaseCommand.mjs";

/**
 */
export class Command<
  TConstructorParams extends ConstructorParams,
> extends Base<TConstructorParams> {
  protected processes: ProcessDef[];

  constructor(params: TConstructorParams) {
    super(params);

    this.processes = params.processes;
  }
}
