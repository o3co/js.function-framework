import { parseArgs } from "node:util";
import type { Factory as CliCommandFactory } from "@o3co/js.function-framework.node/cli/command/Factory.mjs";

export type CreateHandlerOptions = {
  config: {
    runtime?: {
      command?: string;
      response?: string | ({ type?: string } & Record<string, unknown>);
      responseParams?: Record<string, unknown>;
    };
    [key: string]: unknown;
  };
  cliFactory: CliCommandFactory;
  onComplete?: (result: unknown) => Promise<void> | void;
  onError?: (error: unknown) => Promise<void> | void;
};
/**
 */
export const createHandler =
  ({
    config,
    cliFactory,
    onComplete = undefined,
    onError = undefined,
  }: CreateHandlerOptions) =>
  async () => {
    try {
      const runtimeSettings = config.runtime ?? {};

      const { positionals } = parseArgs({
        strict: false, //未定義の引数を許可
        args: process.argv.slice(2), //コマンドライン引数を取得
        allowPositionals: true, //オプション（--xxx）以外の引数も許可
      });

      if (positionals.length < 1) {
        throw new Error("Task not specified");
      }

      const response =
        typeof runtimeSettings.response === "string"
          ? { type: runtimeSettings.response, ...(runtimeSettings.responseParams ?? {}) }
          : typeof runtimeSettings.response === "object"
            ? { ...runtimeSettings.response, ...(runtimeSettings.responseParams ?? {}) }
            : { ...(runtimeSettings.responseParams ?? {}) };

      const ret = await (
        await cliFactory.create(positionals[0], {
          response,
        })
      ).run();

      if (onComplete) {
        await onComplete(ret);
      }

      return ret;
    } catch (cause) {
      if (onError) {
        await onError(cause);
      }
      console.error(cause);
      process.exit(1);
    }
  };
