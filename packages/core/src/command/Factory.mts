import fs from "node:fs";
import path from "node:path";

import { ObjectHelper } from "@o3co/js.function-framework.core/Helpers.mjs";

export type ConstructorParams = {
  autoloadPkg?: string;
  pathResolver?: (string) => string;
} & Record<string, unknown>;

/**
 */
export class Factory {
  protected params: Record<string, unknown>;

  protected pathResolver: (string) => string;

  protected autoloadPkg: string | undefined;

  constructor({
    autoloadPkg = process.env.npm_package_name,
    pathResolver = import.meta.resolve,
    ...params
  }: ConstructorParams) {
    this.params = params;
    this.pathResolver = pathResolver;
    this.autoloadPkg = autoloadPkg;
  }

  create = async (
    name: string,
    params: Record<string, unknown> = {},
  ): Promise<any> => {
    const { processFactory, representerFactory, commands } = this.params;

    const setting = commands?.[name] ?? {};

    const { Command } = await (async () => {
      // If classPath specified, then load the component
      if (setting.type) {
        switch (setting.type) {
          case "SingleTask":
            return await import("./SingleTaskCommand.mjs");
          case "SequentialTasks":
            return await import("./SequentialTasksCommand.mjs");
          case "ParallelTasks":
            return await import("./ParallelTasksCommand.mjs");
          default:
            // otherwise, load the component from type as classPath
            return await import(this.pathResolver(setting.type));
        }
      } else {
        // if type is not specified, then try to load the component from autoloadPkg with command name
        const classPath = this.pathResolver(
          path.join(
            ...[this.autoloadPkg, "commands", `${name}.mjs`].filter(
              (v): v is Exclude<string, undefined> =>
                (v ?? undefined) !== undefined,
            ),
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
}
