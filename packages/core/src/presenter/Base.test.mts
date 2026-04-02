import { describe, it, expect } from "vitest";
import { BasePresenter } from "./Base.mjs";

describe("BasePresenter", () => {
  it("doTransform() throws by default", () => {
    const presenter = new BasePresenter();
    expect(() => presenter.doTransform("anything")).toThrow(
      "doTransform must be implemented by subclass",
    );
  });

  it("transform() delegates to doTransform()", () => {
    const presenter = new BasePresenter();

    presenter.doTransform = (params) => ({ transformed: params });

    const result = presenter.transform("input");
    expect(result).toEqual({ transformed: "input" });
  });

  it("doTransformError() re-throws the cause by default", () => {
    const presenter = new BasePresenter();
    const error = new Error("original error");

    expect(() => presenter.doTransformError(error)).toThrow(error);
  });

  it("doTransformError() re-throws non-Error values", () => {
    const presenter = new BasePresenter();

    expect(() => presenter.doTransformError("string cause")).toThrow(
      "string cause",
    );
  });

  it("transformError() delegates to doTransformError()", () => {
    const presenter = new BasePresenter();

    presenter.doTransformError = (_cause) => ({ error: "handled" });

    const result = presenter.transformError(new Error("boom"));
    expect(result).toEqual({ error: "handled" });
  });

  it("subclass overriding doTransform() and doTransformError() works correctly", () => {
    class JsonPresenter extends BasePresenter {
      doTransform(params: unknown) {
        return { status: 200, body: params };
      }

      doTransformError(cause: unknown) {
        const message =
          cause instanceof Error ? cause.message : String(cause);
        return { status: 500, body: { error: message } };
      }
    }

    const presenter = new JsonPresenter();

    expect(presenter.transform({ data: "ok" })).toEqual({
      status: 200,
      body: { data: "ok" },
    });

    expect(presenter.transformError(new Error("fail"))).toEqual({
      status: 500,
      body: { error: "fail" },
    });
  });
});
