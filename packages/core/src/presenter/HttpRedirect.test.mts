import { describe, it, expect } from "vitest";
import { Presenter } from "./HttpRedirect.mjs";

describe("HttpRedirect Presenter", () => {
  it("doTransform() with url returns redirect response (307 by default)", () => {
    const presenter = new Presenter({ classPath: "HttpRedirect" });

    expect(presenter.doTransform({ url: "https://example.com" })).toEqual({
      statusCode: 307,
      headers: { Location: "https://example.com" },
      body: JSON.stringify({ code: 307, location: "https://example.com" }),
    });
  });

  it("doTransform() with custom statusCode", () => {
    const presenter = new Presenter({ classPath: "HttpRedirect", statusCode: 301 });

    expect(presenter.doTransform({ url: "https://example.com" })).toEqual({
      statusCode: 301,
      headers: { Location: "https://example.com" },
      body: JSON.stringify({ code: 301, location: "https://example.com" }),
    });
  });

  it("doTransform() without url returns 500 error", () => {
    const presenter = new Presenter({ classPath: "HttpRedirect" });

    expect(presenter.doTransform({})).toEqual({
      statusCode: 500,
      body: JSON.stringify({ code: 500, error: "url is not provided to redirect" }),
    });
  });

  it("doTransformError() returns 500", () => {
    const presenter = new Presenter({ classPath: "HttpRedirect" });

    expect(presenter.doTransformError(new Error("bad"))).toEqual({
      statusCode: 500,
      body: JSON.stringify({ code: 500, error: "Bad URL to redirect" }),
    });
  });
});
