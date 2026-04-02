import { Factory as ClientFactory } from '@o3co/js.function-framework.core/client/Factory.mjs';
import { Factory as ExecutorFactory } from '@o3co/js.function-framework.core/executor/Factory.mjs';
import { Factory as TaskFactory } from '@o3co/js.function-framework.core/task/Factory.mjs';
import { Factory as PresenterFactory } from '@o3co/js.function-framework.core/presenter/Factory.mjs';
import { loadConfigFile } from '@o3co/js.function-framework.core/config/index.mjs';

export * as PromiseHelper from '@o3co/js.util.misc/async/index.mjs';

export const config = loadConfigFile(
  new URL('../config/default.conf', import.meta.url).pathname,
);

/**
 */
export const taskFactory = new TaskFactory({
  clientFactory: new ClientFactory({
    pathResolver: import.meta.resolve,
    clients: config.clients ?? {},
  }),
  pathResolver: import.meta.resolve,
  processes: config.processes ?? {},
});

/**
 */
export const presenterFactory = new PresenterFactory({
  pathResolver: import.meta.resolve,
  presenters: config.presenters ?? {},
});

/**
 */
export const executorFactory = new ExecutorFactory({
  pathResolver: import.meta.resolve,
  taskFactory,
  presenterFactory,
  commands: config.commands ?? {},
});
