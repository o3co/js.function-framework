import { parseArgs } from "node:util";
import type { Factory as CliCommandFactory } from "@o3co/js.function-framework.node/cli/command/Factory.mjs";
import { string } from "@o3co/js.util.misc/types/index.mjs";

export type CreateHandlerOptions = {
  config: {
    has: (key: string) => boolean;
    get: (key: string) => unknown;
  };
  cliFactory: CliCommandFactory;
  onComplete?: (result: any) => void;
  onError?: (error: unknown) => void;
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
      const runtimeSettings = (
        config.has("runtime") ? config.get("runtime") : {}
      ) as {
        response?: string;
        responseParams?: Record<string, unknown>;
      };

      const { positionals } = parseArgs({
        strict: false, //未定義の引数を許可
        args: process.argv.slice(2), //コマンドライン引数を取得
        allowPositionals: true, //オプション（--xxx）以外の引数も許可
      });

      if (positionals.length < 1) {
        throw new Error("Task not specified");
      }

      const ret = await (
        await cliFactory.create(positionals[0], {
          response: {
            type: runtimeSettings.response,
            ...(runtimeSettings.responseParams ?? {}),
          },
        })
      ).run();

      if (onComplete) {
        onComplete(ret);
      }

      return ret;
    } catch (cause) {
      if (onError) {
        onError(cause);
      }
      console.error(cause);
      process.exit(1);
    }
  };
