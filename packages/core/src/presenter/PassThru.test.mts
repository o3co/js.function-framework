import { describe, it, expect } from "vitest";
import { Presenter } from "./PassThru.mjs";

describe("PassThru Presenter", () => {
  it("doTransform() returns input unchanged", () => {
    const presenter = new Presenter({ classPath: "PassThru" });

    expect(presenter.doTransform("hello")).toBe("hello");
    expect(presenter.doTransform(42)).toBe(42);
    expect(presenter.doTransform(null)).toBe(null);

    const obj = { key: "value" };
    expect(presenter.doTransform(obj)).toBe(obj);
  });
});
