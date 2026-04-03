import type { ResponseConfig } from "@o3co/js.function-framework.core/executor/Base.mjs";
import type { Factory as ExecutorFactory } from "@o3co/js.function-framework.core/executor/Factory.mjs";
import * as PromiseHelper from "@o3co/js.util.misc/async/index.mjs";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  Handler,
  SQSEvent,
  SQSRecord,
} from "aws-lambda";

export type CreateHandleParams = {
  config: {
    runtime?: {
      command?: string;
      response?: string | ({ type?: string } & Record<string, unknown>);
    };
    [key: string]: unknown;
  };
  executorFactory: ExecutorFactory;
  onError?: (error: unknown) => Promise<void> | void;
  onComplete?: (result: unknown) => Promise<void> | void;
};

const DefaultHandleParams = {
  onComplete: async (_result: unknown) => {},
  onError: async (error: unknown) => {
    console.error("Error occurs:", error);
  },
};

/**
 * Create LambdaHandler for APIGateway Event
 * Supports:
 *  - APIGateway -> Lambda (APIGatewayProxyEvent | APIGatewayProxyEventV2)
 *  - APIGateway -> SQS -> Lambda (SQSEvent -> APIGatewayProxyEvent | APIGatewayProxyEventV2)
 */
export const createHandler = ({
  config,
  executorFactory,
  onComplete = DefaultHandleParams.onComplete,
  onError = DefaultHandleParams.onError,
}: CreateHandleParams): Handler<APIGatewayProxyEvent> => {
  // handleEvent
  return async (
    event: APIGatewayProxyEvent | APIGatewayProxyEventV2 | SQSEvent,
  ) => {
    const parseBody = (
      event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
    ): unknown => {
      const temp =
        event.body && event.isBase64Encoded
          ? Buffer.from(event.body, "base64").toString("utf-8")
          : event.body;
      if (!temp) return null;
      try {
        return JSON.parse(temp);
      } catch (cause) {
        throw new Error("Failed to parse request body as JSON", { cause });
      }
    };

    const handleV1Event = async (event: APIGatewayProxyEvent) => {
      // Get the request body, decode if it's base64 encoded, and parse as JSON
      const body = parseBody(event);

      const queryParams = (() => {
        const result: Record<string, string[]> = {};
        // add multi values
        const keyValues = event.multiValueQueryStringParameters ?? {};
        for (const [key, values] of Object.entries(keyValues)) {
          result[key] = values ?? [];
        }
        // append single value if exists
        for (const [key, value] of Object.entries(
          event.queryStringParameters ?? {},
        )) {
          if (value !== undefined) {
            if (!result[key]) {
              result[key] = [];
            }
            result[key].push(value);
          }
        }

        return result;
      })();

      const headers = (() => {
        const result: Record<string, string[]> = {};
        const keyValues = event.multiValueHeaders ?? {};
        for (const [key, values] of Object.entries(keyValues)) {
          result[key.toLowerCase()] = values ?? [];
        }
        // append single value if exists
        for (const [key, value] of Object.entries(event.headers ?? {})) {
          if (value !== undefined) {
            const lowerKey = key.toLowerCase();
            if (!result[lowerKey]) {
              result[lowerKey] = [];
            }
            result[lowerKey].push(value);
          }
        }

        return result;
      })();

      return await handleRequest({ body, queryParams, headers });
    };

    const handleV2Event = async (event: APIGatewayProxyEventV2) => {
      // Get the request body, decode if it's base64 encoded, and parse as JSON
      const body = parseBody(event);

      const queryParams = (() => {
        // add multi values
        return Object.fromEntries(
          Object.entries(event.queryStringParameters ?? {}).map(
            ([key, value]) => {
              return [key, value ? value.split(",") : []];
            },
          ),
        );
      })();

      const headers = (() => {
        return Object.fromEntries(
          Object.entries(event.headers ?? {}).map(([key, value]) => {
            return [key.toLowerCase(), value ? value.split(",") : []];
          }),
        );
      })();

      return await handleRequest({ body, queryParams, headers });
    };

    const handleSQSRecord = async (record: SQSRecord) => {
      let parsed: APIGatewayProxyEvent | APIGatewayProxyEventV2;
      try {
        parsed = JSON.parse(record.body) as
          | APIGatewayProxyEvent
          | APIGatewayProxyEventV2;
      } catch (cause) {
        throw new Error("Failed to parse SQS record body as APIGateway event", {
          cause,
        });
      }
      return await handleAPIGatewayEvent(parsed);
    };

    const handleRequest = async (request: {
      body: unknown;
      queryParams: Record<string, string[]>;
      headers: Record<string, string[]>;
    }) => {
      const runtime = (config.runtime ?? {}) as Record<string, unknown>;
      const command = runtime.command as string;

      return await (
        await executorFactory.create(command, {
          response: runtime.response as string | ResponseConfig,
        })
      ).run({
        ...(request.body as Record<string, unknown>),
        ...request.queryParams,
      });
    };

    const handleEventRecords = async (event: SQSEvent) => {
      if (!event.Records || event.Records.length === 0) {
        throw new Error("No records found in the event");
      }

      return PromiseHelper.runSeq(event.Records, async (record) => {
        switch (record.eventSource) {
          case "aws:sqs":
            return await handleSQSRecord(record as SQSRecord);
          default:
            throw new Error(`Unsupported event source: ${record.eventSource}`);
        }
      });
    };

    const handleAPIGatewayEvent = async (
      event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
    ) => {
      if ("version" in event && event.version === "2.0") {
        return await handleV2Event(event as APIGatewayProxyEventV2);
      } else {
        return await handleV1Event(event as APIGatewayProxyEvent);
      }
    };

    try {
      const response = (
        await (async () => {
          if (event && "Records" in event) {
            return await handleEventRecords(event as SQSEvent);
          } else {
            // Determine event version and handle accordingly
            return await handleAPIGatewayEvent(
              event as APIGatewayProxyEvent | APIGatewayProxyEventV2,
            );
          }
        })
      )();

      await onComplete?.(response);
      return response;
    } catch (error) {
      await onError?.(error);

      throw error;
    }
  };
};
