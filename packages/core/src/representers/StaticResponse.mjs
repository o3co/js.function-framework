import { Representer as Base } from "./Base.mjs";

/**
 * Return Static Response
 */
export class Representer extends Base {
  constructor(params) {
    if (!params.response) {
      throw new Error(
        'Config "response" is not specified for static representer',
      );
    }

    super(params);
  }

  doTransform(_data) {
    return this.params.response;
  }
}
