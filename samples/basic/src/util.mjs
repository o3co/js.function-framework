import { Factory as ClientFactory } from '@o3co/js.function-framework.core/client/Factory.mjs';
import { Factory as ExecutorFactory } from '@o3co/js.function-framework.core/executor/Factory.mjs';
import { Factory as TaskFactory } from '@o3co/js.function-framework.core/task/Factory.mjs';
import { Factory as PresenterFactory } from '@o3co/js.function-framework.core/presenter/Factory.mjs';
import config from 'config';

export { config };

export * as PromiseHelper from '@o3co/js.util.misc/async/index.mjs';
/**
 */
export const taskFactory = new TaskFactory({
  clientFactory: new ClientFactory({
    pathResolver: import.meta.resolve,
    clients: config.get('clients'),
  }),
  pathResolver: import.meta.resolve,
  processes: config.get('processes'),
});

/**
 */
export const presenterFactory = new PresenterFactory({
  pathResolver: import.meta.resolve,
  presenters: config.has('presenters') ? config.get('presenters') : {},
});

/**
 */
export const executorFactory = new ExecutorFactory({
  pathResolver: import.meta.resolve,
  taskFactory,
  presenterFactory,
  commands: config.get('commands'),
});
