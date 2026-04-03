import type { Factory as ExecutorFactory } from "@o3co/js.function-framework.core/executor/Factory.mjs";

export type LambdaHandlerConfig = {
  runtime?: {
    command?: string;
    response?: string | ({ type?: string } & Record<string, unknown>);
  };
  [key: string]: unknown;
};

export type CreateHandlerParams = {
  config: LambdaHandlerConfig;
  executorFactory: ExecutorFactory;
  onError?: (error: unknown) => Promise<void> | void;
  onComplete?: (result: unknown) => Promise<void> | void;
};
