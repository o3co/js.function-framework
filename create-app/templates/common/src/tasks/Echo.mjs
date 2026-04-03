import { BaseTask as Base } from "@o3co/js.function-framework.core/task/Base.mjs";

export class Task extends Base {
  async doRun({ message }) {
    if (!message) {
      throw new Error("No message provided");
    }
    return { message };
  }
}
