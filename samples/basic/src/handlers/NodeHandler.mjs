import { createHandler, CliCommandFactory  } from '@o3co/js.function-framework.node/handlers/NodeHandler.mjs'
import { config, commandFactory } from '@o3co/sample/util.mjs'


console.log(import.meta.resolve("@o3co/sample/processes/Status.mjs"))

const cliFactory = new CliCommandFactory({
  ...config.has('cli') ? config.get('cli') : {},
  commandFactory,
})

const handler = createHandler({
  config,
  cliFactory,
})


await handler()
