import { describe, it, expect } from "vitest";
import { Presenter } from "./Static.mjs";

describe("Static Presenter", () => {
  it("doTransform() returns the configured return value regardless of input", () => {
    const presenter = new Presenter({ classPath: "Static", return: "fixed-value" });

    expect(presenter.doTransform("anything")).toBe("fixed-value");
    expect(presenter.doTransform({ key: "value" })).toBe("fixed-value");
    expect(presenter.doTransform(null)).toBe("fixed-value");
  });

  it("constructor throws if return is not specified", () => {
    expect(() => new Presenter({ classPath: "Static" } as any)).toThrow(
      'Config "return" is not specified for static presenter',
    );
  });
});
