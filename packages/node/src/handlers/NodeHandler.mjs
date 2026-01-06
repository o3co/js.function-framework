import { parseArgs } from "node:util";

import { deepMerge } from "@o3co/js.util.misc/merge.mjs";

export { Factory as CliCommandFactory } from "@o3co/js.function-framework.node/cli/commands/Factory.mjs";

/**
 */
export const createHandler =
  ({ config, cliFactory }) =>
  async () => {
    try {
      const settings = deepMerge(
        { response: "json" },
        config.has("runtime") ? config.get("runtime") : {},
      );
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
          representer: settings.response,
        })
      ).run();

      console.log(ret);
      return ret;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
