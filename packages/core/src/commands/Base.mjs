/**
 */
export class Command {
  constructor({
    processFactory,
    name,
    process,
    representer,
    representerFactory,
    params = {},
  }) {
    this.commandName = name;
    this.processName = process ?? name;
    this.processFactory = processFactory;
    this.representerFactory = representerFactory;
    this.params = params;

    if (typeof representer === "string") {
      this.representerType = representer;
      this.representerParams = {};
    } else if (typeof representer === "object") {
      const { type: repType = null, ...repParams } = representer;

      this.representerType = repType;
      this.representerParams = repParams;
    }
  }

  /**
   * Final
   */
  run = async (params = {}) => {
    const representer = await this.representerFactory.create(
      this.representerType ?? "pass",
      this.representerParams,
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
