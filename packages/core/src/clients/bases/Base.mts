export interface ClientParams extends Record<string, unknown> {}

/**
 */
export class Client<TParams extends ClientParams> {
  protected params: TParams;

  constructor(params: TParams) {
    this.params = params;
  }
}
