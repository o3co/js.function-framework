import { describe, it, expect } from "vitest";
import { Presenter } from "./HttpJson.mjs";

describe("HttpJson Presenter", () => {
  it("doTransform() returns { statusCode: 200, body: JSON.stringify(...) }", () => {
    const presenter = new Presenter({ classPath: "HttpJson" });
    const data = { foo: "bar" };

    expect(presenter.doTransform(data)).toEqual({
      statusCode: 200,
      body: JSON.stringify(data),
    });
  });

  it("doTransform() with pretty: true returns indented body", () => {
    const presenter = new Presenter({ classPath: "HttpJson", pretty: true });
    const data = { foo: "bar" };

    expect(presenter.doTransform(data)).toEqual({
      statusCode: 200,
      body: JSON.stringify(data, null, 2),
    });
  });

  it("doTransformError() with Error returns 500 with JSON error body", () => {
    const presenter = new Presenter({ classPath: "HttpJson" });
    const error = new Error("fail");

    expect(presenter.doTransformError(error)).toEqual({
      statusCode: 500,
      body: JSON.stringify({ code: 500, error: "fail" }),
    });
  });

  it("doTransformError() with non-Error returns 500 with generic JSON body", () => {
    const presenter = new Presenter({ classPath: "HttpJson" });

    expect(presenter.doTransformError("oops")).toEqual({
      statusCode: 500,
      body: JSON.stringify({ code: 500 }),
    });
  });
});
