import { describe, expect, it } from "vitest";
import { loadConfig, loadConfigAsync } from "./loader.mjs";

describe("loadConfig", () => {
  it("should parse HOCON string and validate", () => {
    const hocon = `
      runtime {
        command = "Echo"
      }
      commands {
        Echo {
          type = "SingleTask"
          response = "json"
        }
      }
    `;
    const config = loadConfig(hocon);
    expect(config.runtime?.command).toBe("Echo");
    expect(config.commands?.Echo?.type).toBe("SingleTask");
  });

  it("should accept runtime without command", () => {
    const hocon = `
      runtime {
      }
    `;
    const config = loadConfig(hocon);
    expect(config.runtime?.command).toBeUndefined();
  });

  it("should handle empty config", () => {
    const config = loadConfig("");
    expect(config).toEqual({});
  });

  it("should support HOCON substitutions", () => {
    const hocon = `
      app_name = "myapp"
      runtime {
        command = \${app_name}
      }
    `;
    const config = loadConfig(hocon);
    expect(config.runtime?.command).toBe("myapp");
  });

  it("should preserve passthrough keys", () => {
    const hocon = `
      custom_key = "custom_value"
    `;
    const config = loadConfig(hocon);
    expect((config as Record<string, unknown>).custom_key).toBe("custom_value");
  });
});

describe("loadConfigAsync", () => {
  it("should parse HOCON string and validate async", async () => {
    const hocon = `
      runtime {
        command = "Test"
      }
    `;
    const config = await loadConfigAsync(hocon);
    expect(config.runtime?.command).toBe("Test");
  });
});
