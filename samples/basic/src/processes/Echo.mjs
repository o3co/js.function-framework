//@ts-check
import { Process as Base } from '@o3co/js.function-framework.core/process/Base.mjs';

/**
 */
export class Process extends Base {
  async doRun({ message }) {
    if (!message) {
      throw new Error('No message provided');
    }

    return { message };
  }
}
