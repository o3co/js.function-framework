import { Representer as Base } from "./Base.mjs";

/**
 */
export class Representer extends Base {
  doTransform({ url }) {
    //
    if (url) {
      return {
        statusCode: 307,
        headers: {
          Location: url,
        },
        body: `Location=${url}`,
      };
    } else {
      return {
        statusCode: 500,
        body: `url is not provided to redirect`,
      };
    }
  }

  doTransformError(_cause) {
    return {
      statusCode: 500,
      body: `Bad URL to redirect`,
    };
  }
}
