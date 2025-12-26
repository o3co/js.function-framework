import { Representer as Base } from "./Base.mjs";

/**
 */
export class Representer extends Base {
  doTransform(data) {
    //
    if (this.params.pretty) {
      return JSON.stringify(data, null, 2);
    } else {
      return JSON.stringify(data);
    }
  }
}
