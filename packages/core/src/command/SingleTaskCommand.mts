import {
  Command as Base,
  type ConstructorParams as BaseConstructorParams,
  type ProcessDef,
  ProcessRunParams,
} from "./BaseCommand.mjs";

export type ConstructorParams = BaseConstructorParams & ProcessDef;

export { ProcessRunParams };
/**
 *
 */
export class Command extends Base<ConstructorParams> {
  protected params: ProcessRunParams;

  protected process: string;

  constructor(params: ConstructorParams) {
    super(params);

    this.process = params.process ?? this.commandName;

    this.params = params.params ?? {};
  }

  async doRun(params: ProcessRunParams): Promise<any> {
    return await (
      await this.processFactory.create(this.process ?? this.commandName)
    ).run({ ...this.params, ...params });
  }
}
