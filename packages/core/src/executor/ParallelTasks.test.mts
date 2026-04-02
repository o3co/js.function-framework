import { describe, it, expect, vi } from "vitest";
import { ParallelTasksExecutor } from "./ParallelTasks.mjs";
import type { TaskFactory, PresenterFactory } from "../interfaces.mjs";

const mockPresenterFactory: PresenterFactory = {
  create: async () => ({
    transform: (input: any) => input,
    transformError: (cause: any) => ({ error: cause }),
  }),
};

describe("ParallelTasksExecutor", () => {
  it("executes tasks with concurrency", async () => {
    const executed: string[] = [];

    const taskFactory: TaskFactory = {
      create: vi.fn(async (name: string) => ({
        run: async () => {
          executed.push(name);
          return name;
        },
      })),
    };

    const executor = new ParallelTasksExecutor({
      taskFactory,
      presenterFactory: mockPresenterFactory,
      name: "par",
      processes: [
        { process: "task-a" },
        { process: "task-b" },
        { process: "task-c" },
      ],
    });

    await executor.doRun({});

    // All three tasks executed (order may vary due to parallelism)
    expect(executed).toHaveLength(3);
    expect(executed).toContain("task-a");
    expect(executed).toContain("task-b");
    expect(executed).toContain("task-c");
  });

  it("default numOfThreads is 5", () => {
    const taskFactory: TaskFactory = {
      create: vi.fn(async () => ({ run: async () => null })),
    };

    const executor = new ParallelTasksExecutor({
      taskFactory,
      presenterFactory: mockPresenterFactory,
      name: "par",
      processes: [],
    });

    expect((executor as any).numOfThreads).toBe(5);
  });

  it("custom numOfThreads", () => {
    const taskFactory: TaskFactory = {
      create: vi.fn(async () => ({ run: async () => null })),
    };

    const executor = new ParallelTasksExecutor({
      taskFactory,
      presenterFactory: mockPresenterFactory,
      name: "par",
      processes: [],
      numOfThreads: 10,
    });

    expect((executor as any).numOfThreads).toBe(10);
  });
});
