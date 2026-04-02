import { describe, it, expect, vi } from "vitest";
import { SingleTaskExecutor } from "./SingleTask.mjs";
import type { TaskFactory, PresenterFactory } from "../interfaces.mjs";

const mockPresenterFactory: PresenterFactory = {
  create: async () => ({
    transform: (input: any) => input,
    transformError: (cause: any) => ({ error: cause }),
  }),
};

describe("SingleTaskExecutor", () => {
  it("doRun() creates task via taskFactory and calls run with merged params", async () => {
    const runSpy = vi.fn(async (params: any) => params);
    const taskFactory: TaskFactory = {
      create: vi.fn(async () => ({ run: runSpy })),
    };

    const executor = new SingleTaskExecutor({
      taskFactory,
      presenterFactory: mockPresenterFactory,
      name: "my-executor",
      process: "my-task",
      params: { a: 1 },
    });

    const result = await executor.doRun({ b: 2 });

    expect(taskFactory.create).toHaveBeenCalledWith("my-task");
    expect(runSpy).toHaveBeenCalledWith({ a: 1, b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("uses executor name as process name when process is not specified", async () => {
    const taskFactory: TaskFactory = {
      create: vi.fn(async () => ({ run: async () => "ok" })),
    };

    const executor = new SingleTaskExecutor({
      taskFactory,
      presenterFactory: mockPresenterFactory,
      name: "fallback-name",
    });

    await executor.doRun({});

    expect(taskFactory.create).toHaveBeenCalledWith("fallback-name");
  });

  it("uses specified process name when provided", async () => {
    const taskFactory: TaskFactory = {
      create: vi.fn(async () => ({ run: async () => "ok" })),
    };

    const executor = new SingleTaskExecutor({
      taskFactory,
      presenterFactory: mockPresenterFactory,
      name: "executor-name",
      process: "explicit-process",
    });

    await executor.doRun({});

    expect(taskFactory.create).toHaveBeenCalledWith("explicit-process");
  });
});
