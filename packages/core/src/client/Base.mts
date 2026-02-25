/**
 */
export class Client<TParams = Record<string, unknown>> {
  protected params: TParams;

  constructor(params: TParams) {
    this.params = params;
  }
}
