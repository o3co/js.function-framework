// ===== Response =====
export type Response = unknown;

// ===== Task（旧 Process）=====
export interface Task<TParams = unknown, TResult = unknown> {
  run(params: TParams): Promise<TResult>;
}

// ===== Client =====
export interface Client {}

export interface ClientFactory {
  create<T extends Client>(name: string): Promise<T>;
}

// ===== Presenter（旧 Representer）=====
export interface Presenter<TInput = unknown, TOutput = Response> {
  transform(input: TInput): TOutput;
  transformError(cause: unknown): TOutput;
}

// ===== Executor（旧 Command）=====
export interface Executor<TParams = unknown, TResult = unknown> {
  run(params: TParams): Promise<TResult>;
}

// ===== Factories =====
export interface TaskFactory {
  create(name: string, params?: Record<string, unknown>): Promise<Task>;
}

export interface PresenterFactory {
  create(name: string, params?: Record<string, unknown>): Promise<Presenter>;
}

export interface ExecutorFactory {
  create(name: string, params?: Record<string, unknown>): Promise<Executor>;
}
