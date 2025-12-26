import { Command as Base } from "./Base.mjs";

/**
 */
export class Command extends Base {
  constructor({ numOfProcesses = 1, ...props }) {
    super(props);

    this.numOfProcesses = numOfProcesses;
  }
}
