import { describe, it, expect } from "vitest";
import { BaseTask } from "./Base.mjs";
import type { ClientFactory } from "../interfaces.mjs";

const mockClientFactory: ClientFactory = {
  create: async <T,>(_name: string): Promise<T> => ({} as T),
};

describe("BaseTask", () => {
  it("init() resolves as a no-op by default", async () => {
    const task = new BaseTask({ clientFactory: mockClientFactory });
    await expect(task.init()).resolves.toBeUndefined();
  });

  it("clientFactory getter returns the injected factory", () => {
    const task = new BaseTask({ clientFactory: mockClientFactory });
    expect(task.clientFactory).toBe(mockClientFactory);
  });

  it("doRun() throws by default", async () => {
    const task = new BaseTask({ clientFactory: mockClientFactory });
    await expect(task.doRun({})).rejects.toThrow(
      "doRun method must be implemented by subclass",
    );
  });

  it("run() delegates to doRun() with merged params (constructor + runtime)", async () => {
    const receivedParams: unknown[] = [];

    class RecordingTask extends BaseTask {
      async doRun(params: unknown) {
        receivedParams.push(params);
        return "ok";
      }
    }

    const task = new RecordingTask({
      clientFactory: mockClientFactory,
      greeting: "hello",
    });

    const result = await task.run({ name: "world" });

    expect(result).toBe("ok");
    expect(receivedParams).toHaveLength(1);
    expect(receivedParams[0]).toEqual({ greeting: "hello", name: "world" });
  });

  it("run() runtime params override constructor params", async () => {
    let merged: unknown;

    class CapturingTask extends BaseTask {
      async doRun(params: unknown) {
        merged = params;
        return null;
      }
    }

    const task = new CapturingTask({
      clientFactory: mockClientFactory,
      key: "from-constructor",
    });

    await task.run({ key: "from-runtime" });
    expect(merged).toEqual({ key: "from-runtime" });
  });

  it("subclass overriding doRun() works correctly", async () => {
    class AddTask extends BaseTask<{ a: number; b: number }, number> {
      async doRun(params: { a: number; b: number }): Promise<number> {
        return params.a + params.b;
      }
    }

    const task = new AddTask({ clientFactory: mockClientFactory });
    const result = await task.run({ a: 2, b: 3 });
    expect(result).toBe(5);
  });
});
