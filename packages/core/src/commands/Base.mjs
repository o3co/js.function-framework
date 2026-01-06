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
    this.representerName = representer;
    this.params = params;
  }

  /**
   * Final
   */
  run = async (params = {}) => {
    const representer = await this.representerFactory.create(
      this.representerName ?? "pass",
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
