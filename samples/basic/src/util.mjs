import { Factory as ClientFactory } from '@o3co/js.function-framework.core/client/Factory.mjs';
import { Factory as CommandFactory } from '@o3co/js.function-framework.core/command/Factory.mjs';
import { Factory as ProcessFactory } from '@o3co/js.function-framework.core/process/Factory.mjs';
import { Factory as RepresenterFactory } from '@o3co/js.function-framework.core/representer/Factory.mjs';
import config from 'config';

export { config };

export * as PromiseHelper from '@o3co/js.util.misc/async/index.mjs';
/**
 */
export const processFactory = new ProcessFactory({
  clientFactory: new ClientFactory({
    pathResolver: import.meta.resolve,
    clients: config.get('clients'),
  }),
  pathResolver: import.meta.resolve,
  processes: config.get('processes'),
});

/**
 */
export const representerFactory = new RepresenterFactory({
  pathResolver: import.meta.resolve,
  representers: config.has('representers') ? config.get('representers') : {},
});

/**
 */
export const commandFactory = new CommandFactory({
  pathResolver: import.meta.resolve,
  processFactory,
  representerFactory,
  commands: config.get('commands'),
});
