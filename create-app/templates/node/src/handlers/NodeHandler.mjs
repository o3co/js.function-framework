import {
  createHandler,
  CliCommandFactory,
} from "@o3co/js.function-framework.node/handlers/NodeHandler.mjs";
import { config, executorFactory } from "{{PROJECT_NAME}}/util.mjs";

const cliFactory = new CliCommandFactory({
  ...(config.cli ?? {}),
  executorFactory,
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
