import fs from "node:fs";
import path from "node:path";

import { ObjectHelper } from "@o3co/js.function-framework.core/Helpers.mjs";
import type { Executor, ExecutorFactory as IExecutorFactory } from "../interfaces.mjs";

export type ConstructorParams = {
  autoloadPkg?: string;
  pathResolver?: (path: string) => string;
} & Record<string, unknown>;

/**
 * Factory class for creating executor instances
 */
export class Factory implements IExecutorFactory {
  protected params: Record<string, unknown>;
  protected pathResolver: (path: string) => string;
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
  ): Promise<Executor> => {
    const { taskFactory, presenterFactory, commands } = this.params as Record<string, any>;

    const setting = commands?.[name] ?? {};

    const mod = await (async () => {
      if (setting.type) {
        switch (setting.type) {
          case "SingleTask":
            return await import("./SingleTask.mjs");
          case "SequentialTasks":
            return await import("./SequentialTasks.mjs");
          case "ParallelTasks":
            return await import("./ParallelTasks.mjs");
          default:
            return await import(this.pathResolver(setting.type));
        }
      } else {
        const classPath = this.pathResolver(
          path.join(
            ...[this.autoloadPkg, "commands", `${name}.mjs`].filter(
              (v): v is Exclude<string, undefined> =>
                (v ?? undefined) !== undefined,
            ),
          ),
        );

        if (fs.existsSync(new URL(classPath))) {
          return await import(classPath);
        } else {
          return await import("./SingleTask.mjs");
        }
      }
    })();

    // Support both new { Executor } and old { Command } exports
    const ExecutorClass = mod.Executor ?? mod.Command;
    if (!ExecutorClass) {
      throw new Error(`Module does not export Executor or Command`);
    }

    const executor = new ExecutorClass({
      ...ObjectHelper.cleanup(setting),
      ...ObjectHelper.cleanup(params),
      taskFactory,
      presenterFactory,
      name,
    });

    return executor as Executor;
  };
}
