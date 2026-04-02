import { describe, it, expect } from "vitest";
import { BaseTask } from "./Base.mjs";
import type { ClientFactory } from "../interfaces.mjs";

const mockClientFactory: ClientFactory = { create: async () => ({}) };

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
    const task = new BaseTask({
      clientFactory: mockClientFactory,
      greeting: "hello",
    });

    const receivedParams: unknown[] = [];

    task.doRun = async (params) => {
      receivedParams.push(params);
      return "ok";
    };

    const result = await task.run({ name: "world" });

    expect(result).toBe("ok");
    expect(receivedParams).toHaveLength(1);
    expect(receivedParams[0]).toEqual({ greeting: "hello", name: "world" });
  });

  it("run() runtime params override constructor params", async () => {
    const task = new BaseTask({
      clientFactory: mockClientFactory,
      key: "from-constructor",
    });

    let merged: unknown;
    task.doRun = async (params) => {
      merged = params;
      return null;
    };

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
