import {
  createHandler,
  CliCommandFactory,
} from '@o3co/js.function-framework.node/handlers/NodeHandler.mjs';
import { config, commandFactory } from '@o3co/sample/util.mjs';

const cliFactory = new CliCommandFactory({
  ...(config.has('cli') ? config.get('cli') : {}),
  commandFactory,
  pathResolver: import.meta.resolve,
});

const handler = createHandler({
  config,
  cliFactory,
  onComplete: (res) => {
    console.log(res);
  },
});

await handler();
