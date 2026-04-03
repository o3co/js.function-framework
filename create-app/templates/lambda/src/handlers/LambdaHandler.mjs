import { createHandler } from "@o3co/js.function-framework.lambda/handlers/APIGatewayEventHandler.mjs";
import { executorFactory, config } from "{{PROJECT_NAME}}/util.mjs";

/**
 * Flatten a nested object into dotted-path Map entries.
 * e.g. { runtime: { command: "Echo" } } => Map { "runtime" => {...}, "runtime.command" => "Echo" }
 */
function toConfigMap(obj, prefix = "") {
  const map = new Map();
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    map.set(fullKey, value);
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const [k, v] of toConfigMap(value, fullKey)) {
        map.set(k, v);
      }
    }
  }
  return map;
}

export const handler = createHandler({
  config: toConfigMap(config),
  executorFactory,
});
