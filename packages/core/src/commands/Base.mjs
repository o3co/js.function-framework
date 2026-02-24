/**
 */
export class Command {
  constructor({
    processFactory,
    name,
    process,
    response,
    representerFactory,
    params = {},
  }) {
    this.commandName = name;
    this.processName = process ?? name;
    this.processFactory = processFactory;
    this.representerFactory = representerFactory;
    this.params = params;

    if (typeof response === "string") {
      this.responseType = response;
      this.responseParams = {};
    } else if (typeof response === "object") {
      const { type: resType = null, ...resParams } = response;

      this.responseType = resType;
      this.responseParams = resParams;
    }
  }

  /**
   * Final
   */
  run = async (params = {}) => {
    const representer = await this.representerFactory.create(
      this.responseType ?? "pass",
      this.responseParams,
    );

    try {
      const ret = await this.doRun({ ...this.params, ...params });

      return representer.transform(ret);
    } catch (cause) {
      return representer.transformError(cause);
    }
  };

  /**
   * Override in subclass
   * @returns {Promise<any>}
   */
  async doRun(_params) {
    // Override Here
  }
}
