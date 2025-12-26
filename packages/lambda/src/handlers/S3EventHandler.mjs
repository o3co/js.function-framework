import * as PromiseHelper from "@o3co/js.util.promise/Helper.mjs";

import { deepMerge } from "deepmerge";

/**
 */
export const createHandler =
  ({ commandFactory }) =>
  async (event) => {
    try {
      return await handleEvent(event);
    } catch (error) {
      console.error("Error processing S3 event:", error);
      throw error;
    }
  };

/**
 * Handle Inbound Event
 */
const handleEvent = async (event) => {
  if (event.Records) {
    const s3RecordsResponse = await PromiseHelper.runSeq(
      event.Records,
      handleRecord
    );

    return s3RecordsResponse.flat();
  } else if (event.TopicArn && event.Message) {
    return await handleEvent(JSON.parse(event.Message));
  }
};

/**
 */
const handleRecord = async (record) => {
  switch (record.eventSource) {
    case "aws:sqs": {
      const ret = await (async () => {
        try {
          await handleEvent(JSON.parse(record.body));
          return { batchItemFailures: [] };
        } catch (_cause) {
          return {
            batchItemFailures: [{ itemIdentifier: record.messageId }],
          };
        }
      })();

      return ret;
    }
    case "aws:s3":
      return await handleCommand(record);
    default:
      throw new Error(`Unsupported event source: ${record.eventSource}`);
  }
};

/**
 */
const handleCommand = async (record) => {
  // only for s3 handler
  //const command = record.command ?? config.get('runtime.command')
  const command = config.get("runtime.command");

  return await (
    await commandFactory.create(command, {
      representer: config.get("runtime.representer"),
    })
  ).run({
    ...record,
    uri: `s3://${record.s3.bucket.name}/${record.s3.object.key}`,
  });
};
