import { resolveModulePath } from "@o3co/js.function-framework.core/Helpers.mjs";
import type { Task, TaskFactory as ITaskFactory, ClientFactory } from "../interfaces.mjs";
import type { TaskConfig } from "../config/schema.mjs";

export type ConstructorParams = {
  autoloadPkg?: string;
  pathResolver?: (path: string) => string;
  clientFactory: ClientFactory;
  processes?: Record<string, TaskConfig>;
};

export type CreateParams = Record<string, unknown>;

/**
 * Factory class for creating task instances
 */
export class Factory implements ITaskFactory {
  private clientFactory: ClientFactory;
  private processes: Record<string, TaskConfig>;
  private autoloadPkg: string | undefined;
  private pathResolver: (path: string) => string;

  constructor({
    autoloadPkg = process.env.npm_package_name,
    pathResolver = import.meta.resolve,
    clientFactory,
    processes = {},
  }: ConstructorParams) {
    this.clientFactory = clientFactory;
    this.processes = processes;
    this.pathResolver = pathResolver;
    this.autoloadPkg = autoloadPkg ?? process.env.npm_package_name;
  }

  create = async (name: string, params: CreateParams = {}): Promise<Task> => {
    const setting = this.processes[name] ?? {};

    const config: Record<string, unknown> & { classPath?: string } = {
      ...setting,
      ...params,
      clientFactory: this.clientFactory,
    };

    const classPath = typeof config.classPath === "string" ? config.classPath : undefined;

    try {
      const mod = await import(
        classPath
          ? this.pathResolver(classPath)
          : resolveModulePath(this.pathResolver, this.autoloadPkg, "tasks", name)
      );

      const TaskClass = mod.BaseTask ?? mod.Task ?? mod.Process;
      if (!TaskClass) {
        throw new Error(`Module does not export Task or Process`);
      }

      const task = new TaskClass(config);
      await task.init();

      return task as Task;
    } catch (cause) {
      throw new Error(`Failed to import Task "${name}"`, { cause });
    }
  };
}
