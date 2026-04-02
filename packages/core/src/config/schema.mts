import { z } from "zod";

export const ResponseConfigSchema = z.union([
  z.string(),
  z.object({ type: z.string().optional() }).passthrough(),
]);

export const ExecutorConfigSchema = z.object({
  type: z.string().optional(),
  response: ResponseConfigSchema.optional(),
  process: z.string().optional(),
  params: z.record(z.unknown()).optional(),
  processes: z.array(z.object({
    process: z.string().optional(),
    params: z.record(z.unknown()).optional(),
  })).optional(),
  numOfThreads: z.number().optional(),
}).passthrough();

export const TaskConfigSchema = z.object({
  classPath: z.string().optional(),
}).passthrough();

export const ClientConfigSchema = z.object({
  classPath: z.string().optional(),
}).passthrough();

export const PresenterConfigSchema = z.object({
  classPath: z.string(),
}).passthrough();

export const RuntimeConfigSchema = z.object({
  command: z.string(),
  response: ResponseConfigSchema.optional(),
});

export const ConfigSchema = z.object({
  runtime: RuntimeConfigSchema.optional(),
  commands: z.record(ExecutorConfigSchema).optional(),
  processes: z.record(TaskConfigSchema).optional(),
  clients: z.record(ClientConfigSchema).optional(),
  presenters: z.record(PresenterConfigSchema).optional(),
}).passthrough();

export type Config = z.infer<typeof ConfigSchema>;
export type ExecutorConfig = z.infer<typeof ExecutorConfigSchema>;
export type TaskConfig = z.infer<typeof TaskConfigSchema>;
export type ClientConfig = z.infer<typeof ClientConfigSchema>;
export type PresenterConfig = z.infer<typeof PresenterConfigSchema>;
export type RuntimeConfig = z.infer<typeof RuntimeConfigSchema>;
