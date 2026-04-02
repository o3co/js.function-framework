import { parse, parseAsync, parseFile, parseFileAsync } from "@o3co/ts.hocon";
import { ConfigSchema, type Config } from "./schema.mjs";

export function loadConfig(hoconString: string): Config {
  const raw = parse(hoconString);
  return ConfigSchema.parse(raw.toObject());
}

export async function loadConfigAsync(hoconString: string): Promise<Config> {
  const raw = await parseAsync(hoconString);
  return ConfigSchema.parse(raw.toObject());
}

export function loadConfigFile(filePath: string): Config {
  const raw = parseFile(filePath);
  return ConfigSchema.parse(raw.toObject());
}

export async function loadConfigFileAsync(filePath: string): Promise<Config> {
  const raw = await parseFileAsync(filePath);
  return ConfigSchema.parse(raw.toObject());
}
