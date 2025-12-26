//@ts-check
/**
 */
export class Process {
  constructor(params) {
    this.params = params;
  }

  async init() {}

  get clientFactory() {
    return this.params.clientFactory;
  }

  run = async (params) => {
    return await this.doRun(params);
  };

  /**
   * @returns {Promise<any>}
   */
  async doRun(_params) {}
}
