import type { ResponseConfig } from "@o3co/js.function-framework.core/executor/Base.mjs";
import type { Factory as ExecutorFactory } from "@o3co/js.function-framework.core/executor/Factory.mjs";
import * as PromiseHelper from "@o3co/js.util.misc/async/index.mjs";
import type {
  Handler,
  S3Event,
  S3EventRecord,
  SNSEvent,
  SNSEventRecord,
  SNSMessage,
  SQSEvent,
  SQSRecord,
} from "aws-lambda";

export type CreateHandleParams = {
  config: Map<string, unknown>;
  executorFactory: ExecutorFactory;
  onComplete?: (result: unknown) => Promise<void> | void;
  onError?: (error: unknown) => Promise<void> | void;
};

const DefaultHandleParams = {
  onComplete: async (result) => {
    console.log("S3EventHandler completed with result:", result);
  },
  onError: async (error) => {
    console.error("S3EventHandler encountered an error:", error);
  },
};

/**
 * Create LambdaHandler
 * Supports:
 *  - S3 -> Lambda (S3Event)
 *  - S3 -> SQS -> Lambda (SQSEvent -> S3Event)
 *  - S3 -> SNS -> SQS -> Lambda (SQSEvent -> SNSEvent -> S3Event)
 */
export const createHandler = ({
  config,
  executorFactory,
  onComplete = DefaultHandleParams.onComplete,
  onError = DefaultHandleParams.onError,
}: CreateHandleParams): Handler<S3Event | SQSEvent | SNSEvent> => {
  // handleEvent
  return async (event: S3Event | SQSEvent | SNSEvent) => {
    const isSNSMessage = (event: any): event is SNSMessage => {
      return (
        typeof event?.TopicArn === "string" &&
        typeof event?.Message === "string"
      );
    };

    const handleEventOrSnsMessage = async (
      event: S3Event | SQSEvent | SNSEvent | SNSMessage,
    ) => {
      if (isSNSMessage(event)) {
        const snsMessage = event as SNSMessage;

        return await handleEventOrSnsMessage(
          JSON.parse(snsMessage.Message) as S3Event,
        );
      } else if ((event as S3Event | SQSEvent).Records) {
        const s3RecordsResponse = await PromiseHelper.runSeq(
          (event as S3Event | SQSEvent).Records,
          handleRecord,
        );

        return s3RecordsResponse.flat();
      }
    };

    const handleRecord = async (
      record: S3EventRecord | SQSRecord | SNSEventRecord,
    ) => {
      const isSNSRecord = (record: any): record is SNSEventRecord => {
        return record?.EventSource === "aws:sns" || Boolean(typeof record?.Sns);
      };

      if (isSNSRecord(record)) {
        const snsRecord = record as SNSEventRecord;
        return await handleEventOrSnsMessage(
          JSON.parse(snsRecord.Sns.Message) as S3Event,
        );
      } else {
        return await handleRecordForS3OrSQS(
          record as S3EventRecord | SQSRecord,
        );
      }
    };
    /**
     */
    const handleRecordForS3OrSQS = async (
      record: S3EventRecord | SQSRecord,
    ) => {
      switch (record?.eventSource) {
        case "aws:s3":
          return await handleCommandForS3Record(record as S3EventRecord);
        case "aws:sqs": {
          const sqsRecord = record as SQSRecord;
          const ret = await (async () => {
            try {
              await handleEventOrSnsMessage(
                JSON.parse(sqsRecord.body) as SNSMessage,
              );
              return { batchItemFailures: [] };
            } catch (_cause) {
              return {
                batchItemFailures: [{ itemIdentifier: sqsRecord.messageId }],
              };
            }
          })();

          return ret;
        }
        default:
          throw new Error(`Unsupported event source: ${record.eventSource}`);
      }
    };

    /**
     * Actual command handling logic for S3EventRecord
     * - Constructs the command based on the configuration and the S3 record details
     * - Executes the command and returns the result
     */
    const handleCommandForS3Record = async (record: S3EventRecord) => {
      // Execute command from the configuration
      const command = config.get("runtime.command") as string;

      return await (
        await executorFactory.create(command, {
          response: config.get("runtime.response") as string | ResponseConfig,
        })
      ).run({
        ...record,
        uri: `s3://${record.s3.bucket.name}/${record.s3.object.key}`,
      });
    };

    // -----------------------------------------------------------------------------------------------
    // actual handler logic
    try {
      const ret = await handleEventOrSnsMessage(event);

      await onComplete?.(ret);
      return ret;
    } catch (error) {
      await onError?.(error);

      throw error;
    }
  };
};
