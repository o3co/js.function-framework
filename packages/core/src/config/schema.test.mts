import { describe, expect, it } from "vitest";
import { ConfigSchema } from "./schema.mjs";

describe("ConfigSchema", () => {
  it("should validate a minimal config", () => {
    const result = ConfigSchema.parse({});
    expect(result).toEqual({});
  });

  it("should validate a full config", () => {
    const input = {
      runtime: {
        command: "Echo",
        response: "json",
      },
      commands: {
        Echo: {
          type: "SingleTask",
          response: { type: "static", return: '{"ok": true}' },
        },
      },
      tasks: {
        Echo: { classPath: "./tasks/Echo.mjs" },
      },
      clients: {
        s3: { classPath: "./clients/S3.mjs" },
      },
      presenters: {
        custom: { classPath: "./presenters/Custom.mjs" },
      },
    };
    const result = ConfigSchema.parse(input);
    expect(result.runtime?.command).toBe("Echo");
    expect(result.commands?.Echo?.type).toBe("SingleTask");
  });

  it("should allow passthrough keys", () => {
    const input = {
      runtime: { command: "test" },
      customKey: "customValue",
    };
    const result = ConfigSchema.parse(input);
    expect((result as Record<string, unknown>).customKey).toBe("customValue");
  });

  it("should accept runtime without command", () => {
    const input = {
      runtime: {
        response: "json",
      },
    };
    const result = ConfigSchema.parse(input);
    expect(result.runtime?.command).toBeUndefined();
    expect(result.runtime?.response).toBe("json");
  });

  it("should preserve extra runtime keys (e.g. responseParams)", () => {
    const input = {
      runtime: {
        command: "test",
        responseParams: { pretty: true },
      },
    };
    const result = ConfigSchema.parse(input);
    expect((result.runtime as Record<string, unknown>).responseParams).toEqual({ pretty: true });
  });

  it("should accept response as string", () => {
    const input = {
      commands: {
        Echo: { response: "json" },
      },
    };
    const result = ConfigSchema.parse(input);
    expect(result.commands?.Echo?.response).toBe("json");
  });

  it("should accept response as object", () => {
    const input = {
      commands: {
        Echo: { response: { type: "http_json", pretty: true } },
      },
    };
    const result = ConfigSchema.parse(input);
    expect(result.commands?.Echo?.response).toEqual({ type: "http_json", pretty: true });
  });
});
