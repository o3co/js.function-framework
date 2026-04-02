import fs from "node:fs";
import path from "node:path";

import { ObjectHelper } from "@o3co/js.function-framework.core/Helpers.mjs";
import type { Executor, ExecutorFactory as IExecutorFactory, TaskFactory, PresenterFactory } from "../interfaces.mjs";
import type { ExecutorConfig } from "../config/schema.mjs";

export type ConstructorParams = {
  autoloadPkg?: string;
  pathResolver?: (path: string) => string;
  taskFactory: TaskFactory;
  presenterFactory: PresenterFactory;
  commands?: Record<string, ExecutorConfig>;
};

/**
 * Factory class for creating executor instances
 */
export class Factory implements IExecutorFactory {
  protected taskFactory: TaskFactory;
  protected presenterFactory: PresenterFactory;
  protected commands: Record<string, ExecutorConfig>;
  protected pathResolver: (path: string) => string;
  protected autoloadPkg: string | undefined;

  constructor({
    autoloadPkg = process.env.npm_package_name,
    pathResolver = import.meta.resolve,
    taskFactory,
    presenterFactory,
    commands = {},
  }: ConstructorParams) {
    this.taskFactory = taskFactory;
    this.presenterFactory = presenterFactory;
    this.commands = commands;
    this.pathResolver = pathResolver;
    this.autoloadPkg = autoloadPkg;
  }

  create = async (
    name: string,
    params: Record<string, unknown> = {},
  ): Promise<Executor> => {
    const setting = this.commands[name] ?? {};

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
              (v): v is string => v != null,
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

    const ExecutorClass = mod.Executor ?? mod.Command;
    if (!ExecutorClass) {
      throw new Error(`Module for executor "${name}" does not export Executor or Command`);
    }

    const executor = new ExecutorClass({
      ...ObjectHelper.cleanup(setting),
      ...ObjectHelper.cleanup(params),
      taskFactory: this.taskFactory,
      presenterFactory: this.presenterFactory,
      name,
    });

    return executor as Executor;
  };
}
