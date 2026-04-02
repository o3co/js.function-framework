import { describe, it, expect } from "vitest";
import { Presenter } from "./Http.mjs";

describe("Http Presenter", () => {
  it("doTransform() returns { statusCode: 200, body }", () => {
    const presenter = new Presenter({ classPath: "Http" });
    const body = { message: "ok" };

    expect(presenter.doTransform(body)).toEqual({
      statusCode: 200,
      body,
    });
  });

  it("doTransformError() with Error returns { statusCode: 500, body: error.message }", () => {
    const presenter = new Presenter({ classPath: "Http" });
    const error = new Error("something broke");

    expect(presenter.doTransformError(error)).toEqual({
      statusCode: 500,
      body: "something broke",
    });
  });

  it("doTransformError() with non-Error returns { statusCode: 500, body: 'Internal Server Error' }", () => {
    const presenter = new Presenter({ classPath: "Http" });

    expect(presenter.doTransformError("random string")).toEqual({
      statusCode: 500,
      body: "Internal Server Error",
    });

    expect(presenter.doTransformError(42)).toEqual({
      statusCode: 500,
      body: "Internal Server Error",
    });
  });
});
