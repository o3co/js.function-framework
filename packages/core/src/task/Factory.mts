import path from "node:path";
import type { Task, TaskFactory as ITaskFactory } from "../interfaces.mjs";

type ConstructorParams = {
  autoloadPkg?: string;
  pathResolver?: (path: string) => string;
} & Record<string, unknown>;

export type CreateParams = Record<string, unknown>;

/**
 * Factory class for creating task instances
 */
export class Factory implements ITaskFactory {
  private config: Record<string, unknown>;
  private autoloadPkg: string | undefined;
  private pathResolver: (path: string) => string;

  constructor({
    autoloadPkg = process.env.npm_package_name,
    pathResolver = import.meta.resolve,
    ...config
  }: ConstructorParams) {
    this.config = config;
    this.pathResolver = pathResolver;
    this.autoloadPkg = autoloadPkg ?? process.env.npm_package_name;
  }

  create = async (name: string, params: CreateParams = {}): Promise<Task> => {
    const { clientFactory, processes } = this.config;

    const setting = (processes as Record<string, Record<string, unknown>> | undefined)?.[name] ?? {};

    const config = {
      ...setting,
      ...params,
      clientFactory,
    };

    try {
      const mod = await import(
        this.pathResolver(
          (config as Record<string, string>).classPath ??
            path.join(
              ...[this.autoloadPkg, "processes", `${name}.mjs`].filter(
                (v): v is Exclude<typeof v, undefined> => v !== undefined,
              ),
            ),
        )
      );

      const TaskClass = mod.Task ?? mod.Process;
      if (!TaskClass) {
        throw new Error(`Module does not export Task or Process`);
      }

      const task = new TaskClass(config);
      await task.init();

      return task as Task;
    } catch (cause) {
      throw new Error(`Failed to import Task`, { cause });
    }
  };
}
