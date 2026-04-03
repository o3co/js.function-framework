import { createHandler } from "@o3co/js.function-framework.lambda/handlers/APIGatewayEventHandler.mjs";
import { executorFactory, config } from "{{PROJECT_NAME}}/util.mjs";

export const handler = createHandler({
  config: new Map(Object.entries(config)),
  executorFactory,
});
