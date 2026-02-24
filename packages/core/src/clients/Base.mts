/**
 */
export class Client<TParams> {
  protected params: TParams;

  constructor(params: TParams) {
    this.params = params;
  }
}
