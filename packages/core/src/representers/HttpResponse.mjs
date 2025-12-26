import { Representer as Base } from "./Base.mjs";

/**
 */
export class Representer extends Base {
  doTransform(body) {
    //
    return {
      statusCode: 200,
      body,
    };
  }

  doTransformError(cause) {
    return {
      statusCode: 500,
      body: cause.message,
    };
  }
}
