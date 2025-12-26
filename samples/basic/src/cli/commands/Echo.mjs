import { Command as Base } from "@o3co/js.service-framework.node/cli/commands/Base.mjs";

/**
 */
export class Command extends Base {
  inputOptions() {
    return {
      options: {
        format: {
          type: "string",
        },
      },
    };
  }

  async doRun(_, positionals) {
    const [_command, ...message] = positionals;

    const params = message.length ? { message: message.join(" ") } : {};

    return await this.runCommand("Echo", params);
  }
}

