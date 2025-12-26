import fs from "node:fs/promises";

/**
 */
export class Factory {
  constructor({ representers }) {
    this.representers = representers;
  }

  create = async (name, params = {}) => {
    const setting = this.representers?.[name];

    if (!setting) {
      throw new Error(`Representer ${name} is not defined`);
    }

    const { Representer } = await (async () => {
      const classPath = `./${setting.className}.mjs`;

      await fs.access(new URL(classPath, import.meta.url));

      return await import(classPath);
    })();

    const repr = new Representer({
      ...setting,
      ...params,
      name,
    });

    return repr;
  };
}
