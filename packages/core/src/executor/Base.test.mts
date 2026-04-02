import { describe, it, expect, vi } from "vitest";
import { BaseExecutor, type ConstructorParams } from "./Base.mjs";
import type { TaskFactory, PresenterFactory } from "../interfaces.mjs";

// ── Mock factories ──────────────────────────────────────────────────
const mockTaskFactory: TaskFactory = {
  create: async (_name: string) => ({
    run: async (params: any) => params,
  }),
};

const mockPresenterFactory: PresenterFactory = {
  create: async () => ({
    transform: (input: any) => input,
    transformError: (cause: any) => ({ error: cause }),
  }),
};

// ── Concrete subclass for testing ───────────────────────────────────
class TestExecutor extends BaseExecutor<ConstructorParams> {
  doRunImpl: ((params: any) => Promise<unknown>) | null = null;

  async doRun(params: Record<string, unknown>): Promise<unknown> {
    if (this.doRunImpl) return this.doRunImpl(params);
    return super.doRun(params);
  }
}

describe("BaseExecutor", () => {
  it("run() calls doRun() then presenter.transform()", async () => {
    const executor = new TestExecutor({
      taskFactory: mockTaskFactory,
      presenterFactory: mockPresenterFactory,
      name: "test",
    });
    executor.doRunImpl = async () => "result";

    const result = await executor.run({});
    // transform is identity, so we get the doRun return value
    expect(result).toBe("result");
  });

  it("run() catches errors and calls presenter.transformError()", async () => {
    const executor = new TestExecutor({
      taskFactory: mockTaskFactory,
      presenterFactory: mockPresenterFactory,
      name: "test",
    });
    executor.doRunImpl = async () => {
      throw new Error("boom");
    };

    const result = await executor.run({});
    expect(result).toEqual({ error: expect.any(Error) });
    expect((result as any).error.message).toBe("boom");
  });

  it("doRun() throws by default", async () => {
    const executor = new BaseExecutor({
      taskFactory: mockTaskFactory,
      presenterFactory: mockPresenterFactory,
      name: "test",
    });

    await expect(executor.doRun({})).rejects.toThrow(
      "doRun method must be implemented by subclass",
    );
  });

  it("string response config sets responseType", () => {
    const executor = new TestExecutor({
      taskFactory: mockTaskFactory,
      presenterFactory: mockPresenterFactory,
      name: "test",
      response: "json",
    });

    expect((executor as any).responseType).toBe("json");
    expect((executor as any).responseParams).toEqual({});
  });

  it("object response config sets responseType and responseParams", () => {
    const executor = new TestExecutor({
      taskFactory: mockTaskFactory,
      presenterFactory: mockPresenterFactory,
      name: "test",
      response: { type: "json", pretty: true },
    });

    expect((executor as any).responseType).toBe("json");
    expect((executor as any).responseParams).toEqual({ pretty: true });
  });

  it('default response type is "pass"', async () => {
    const createSpy = vi.fn(async () => ({
      transform: (input: any) => input,
      transformError: (cause: any) => ({ error: cause }),
    }));

    const spyPresenterFactory: PresenterFactory = { create: createSpy };

    const executor = new TestExecutor({
      taskFactory: mockTaskFactory,
      presenterFactory: spyPresenterFactory,
      name: "test",
    });
    executor.doRunImpl = async () => "ok";

    await executor.run({});

    expect(createSpy).toHaveBeenCalledWith("pass", {});
  });
});
