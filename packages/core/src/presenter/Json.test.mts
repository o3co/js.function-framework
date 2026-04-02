import { describe, it, expect } from "vitest";
import { Presenter } from "./Json.mjs";

describe("Json Presenter", () => {
  it("doTransform() returns JSON.stringify result", () => {
    const presenter = new Presenter({ classPath: "Json" });
    const data = { foo: "bar", num: 1 };

    expect(presenter.doTransform(data)).toBe(JSON.stringify(data));
  });

  it("doTransform() with pretty: true returns indented JSON", () => {
    const presenter = new Presenter({ classPath: "Json", pretty: true });
    const data = { foo: "bar", num: 1 };

    expect(presenter.doTransform(data)).toBe(JSON.stringify(data, null, 2));
  });
});
