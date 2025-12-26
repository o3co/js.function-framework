import { createHandler, CliCommandFactory  } from '@o3co/js.service-framework.node/handlers/NodeHandler.mjs'
import { config, commandFactory } from '@o3co/sample.basic/util.mjs'

const cliFactory = new CliCommandFactory({
  ...config.has('cli') ? config.get('cli') : {},
  commandFactory,
})

const handler = createHandler({
  config,
  cliFactory,
})


await handler()
