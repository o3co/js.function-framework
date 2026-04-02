import type { ResponseConfig } from "@o3co/js.function-framework.core/command/BaseCommand.mjs";
import type { Factory as CommandFactory } from "@o3co/js.function-framework.core/command/Factory.mjs";
import * as PromiseHelper from "@o3co/js.util.misc/async/index.mjs";
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  Handler,
  SQSEvent,
  SQSRecord,
} from "aws-lambda";

export type CreateHandleParams = {
  config: Map<string, unknown>;
  commandFactory: CommandFactory;
  onError?: (error: unknown) => Promise<void> | void;
  onComplete?: (result: unknown) => Promise<void> | void;
};

const DefaultHandleParams = {
  onComplete: async (_result) => {},
  onError: async (error) => {
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
  commandFactory,
  onComplete = DefaultHandleParams.onComplete,
  onError = DefaultHandleParams.onError,
}: CreateHandleParams): Handler<APIGatewayProxyEvent> => {
  // handleEvent
  return async (
    event: APIGatewayProxyEvent | APIGatewayProxyEventV2 | SQSEvent,
  ) => {
    const parseBody = (
      event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
    ): any => {
      const temp =
        event.body && event.isBase64Encoded
          ? Buffer.from(event.body, "base64").toString("utf-8")
          : event.body;
      return temp ? JSON.parse(temp) : null;
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
      return await handleAPIGatewayEvent(
        JSON.parse(record.body) as
          | APIGatewayProxyEvent
          | APIGatewayProxyEventV2,
      );
    };

    const handleRequest = async (request: {
      body: any;
      queryParams: Record<string, string[]>;
      headers: Record<string, string[]>;
    }) => {
      const command = config.get("runtime.command") as string;

      return await (
        await commandFactory.create(command, {
          response: config.get("runtime.response") as string | ResponseConfig,
        })
      ).run({
        ...request.body,
        ...request.queryParams,
      });
    };

    const handleEventRecords = async (event: SQSEvent) => {
      if (!event.Records || event.Records.length === 0) {
        throw new Error("No records found in the event");
      }

      PromiseHelper.runSeq(event.Records, async (record) => {
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

    // ------------------------------------------------------------------------------------------------
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
