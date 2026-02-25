import { Command as Base } from '@o3co/js.function-framework.node/cli/command/Base.mjs';

/**
 */
export class Command extends Base {
  inputOptions() {
    return {
      options: {
        format: {
          type: 'string',
        },
      },
    };
  }

  async doRun({ format }, positionals) {
    const [_command, ...message] = positionals;

    const params = message.length ? { message: message.join(' ') } : {};

    return await this.runCommand('Echo', {
      ...params,
      representer: format ?? 'pass',
    });
  }
}
