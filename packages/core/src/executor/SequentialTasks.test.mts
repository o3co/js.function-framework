import { describe, it, expect, vi } from "vitest";
import { SequentialTasksExecutor } from "./SequentialTasks.mjs";
import type { TaskFactory, PresenterFactory } from "../interfaces.mjs";

const mockPresenterFactory: PresenterFactory = {
  create: async () => ({
    transform: (input: any) => input,
    transformError: (cause: any) => ({ error: cause }),
  }),
};

describe("SequentialTasksExecutor", () => {
  it("executes tasks sequentially (verify order)", async () => {
    const order: string[] = [];

    const taskFactory: TaskFactory = {
      create: vi.fn(async (name: string) => ({
        run: async () => {
          order.push(name);
          return name;
        },
      })),
    };

    const executor = new SequentialTasksExecutor({
      taskFactory,
      presenterFactory: mockPresenterFactory,
      name: "seq",
      processes: [
        { process: "task-a" },
        { process: "task-b" },
        { process: "task-c" },
      ],
    });

    await executor.doRun({});

    expect(order).toEqual(["task-a", "task-b", "task-c"]);
  });

  it("passes params to each task", async () => {
    const runs: Record<string, unknown>[] = [];

    const taskFactory: TaskFactory = {
      create: vi.fn(async () => ({
        run: async (params: any) => {
          runs.push(params);
          return params;
        },
      })),
    };

    const executor = new SequentialTasksExecutor({
      taskFactory,
      presenterFactory: mockPresenterFactory,
      name: "seq",
      processes: [
        { process: "t1", params: { x: 1 } },
        { process: "t2", params: { y: 2 } },
      ],
    });

    await executor.doRun({ shared: true });

    expect(runs[0]).toEqual({ x: 1, shared: true });
    expect(runs[1]).toEqual({ y: 2, shared: true });
  });
});
