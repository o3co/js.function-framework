import fs from "node:fs";

import { ObjectHelper, resolveModulePath } from "@o3co/js.function-framework.core/Helpers.mjs";
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

    const ExecutorClass = await (async () => {
      if (setting.type) {
        switch (setting.type) {
          case "SingleTask":
            return (await import("./SingleTask.mjs")).SingleTaskExecutor;
          case "SequentialTasks":
            return (await import("./SequentialTasks.mjs")).SequentialTasksExecutor;
          case "ParallelTasks":
            return (await import("./ParallelTasks.mjs")).ParallelTasksExecutor;
          default: {
            const mod = await import(this.pathResolver(setting.type));
            return mod.Executor ?? mod.Command;
          }
        }
      } else {
        const classPath = resolveModulePath(this.pathResolver, this.autoloadPkg, "commands", name);

        if (fs.existsSync(new URL(classPath))) {
          const mod = await import(classPath);
          return mod.Executor ?? mod.Command;
        } else {
          return (await import("./SingleTask.mjs")).SingleTaskExecutor;
        }
      }
    })();

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
