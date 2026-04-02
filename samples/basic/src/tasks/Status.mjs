import { BaseTask as Base } from "@o3co/js.function-framework.core/task/Base.mjs";

/**
 */
export class Task extends Base {
  async doRun() {
    return { message: "Ok" };
  }
}
