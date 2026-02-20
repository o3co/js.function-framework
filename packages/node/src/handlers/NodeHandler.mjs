import { parseArgs } from "node:util";

export { Factory as CliCommandFactory } from "@o3co/js.function-framework.node/cli/commands/Factory.mjs";

/**
 */
export const createHandler =
  ({ config, cliFactory, onComplete = null, onError = null }) =>
  async () => {
    try {
      const runtimeSettings = config.has("runtime")
        ? config.get("runtime")
        : {};

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
          representer: runtimeSettings.representer ?? runtimeSettings.response,
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
