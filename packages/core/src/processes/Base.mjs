//@ts-check
/**
 */
export class Process {
  constructor({ clientFactory, params }) {
    this._clientFactory = clientFactory;
    this.params = params;
  }

  async init() {}

  get clientFactory() {
    return this._clientFactory;
  }

  run = async (params) => {
    return await this.doRun({
      ...(this.params ?? {}),
      ...params,
    });
  };

  /**
   * @returns {Promise<any>}
   */
  async doRun(_params) {}
}
