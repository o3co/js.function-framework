import fs from "node:fs";
import path from "node:path";

import { ObjectHelper } from "@o3co/js.function-framework.core/Helpers.mjs";

/**
 */
export class Factory {
  constructor({
    autoloadPkg = process.env.npm_package_name,
    pathResolver = import.meta.resolve,
    ...params
  }) {
    this.params = params;
    this.pathResolver = pathResolver;
    this.autoloadPkg = autoloadPkg;
  }

  create = async (name, params = {}) => {
    const { processFactory, representerFactory, commands } = this.params;

    const setting = commands?.[name] ?? {};

    const { Command } = await (async () => {
      // If classPath specified, then load the component
      if (setting.classPath) {
        return await import(this.pathResolver(setting.classPath));
      } else {
        // resolve autoload path
        const classPath = this.pathResolver(
          path.join(
            ...[this.autoloadPkg, "commands", `${name}.mjs`].filter((v) => v),
          ),
        );

        // if file existed, then load the component
        if (fs.existsSync(new URL(classPath))) {
          return await import(classPath);
        } else {
          // otherwise, load SingleTaskCommand
          return await import("./SingleTaskCommand.mjs");
        }
      }
    })();

    const command = new Command({
      ...ObjectHelper.cleanup(setting),
      ...ObjectHelper.cleanup(params),
      processFactory,
      representerFactory,
      name,
    });

    return command;
  };

  run = async (name, params) => {
    const command = await this.create(name);

    return await command.run(params);
  };
}
