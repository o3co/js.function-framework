import { Representer as Base } from "./Base.mjs";
import type {
  HttpJsonConstructionParams,
  HttpJsonParams,
} from "./HttpJsonResponse.mjs";
import type { HttpResponse } from "./HttpResponse.mjs";
/**
 */
export type HttpRedirectConstructionParams = HttpJsonConstructionParams & {
  statusCode?: number;
};

export type HttpRedirectParams = HttpJsonParams & {
  url?: string;
};

export class Representer extends Base<
  HttpRedirectConstructionParams,
  HttpRedirectParams
> {
  doTransform(params: HttpRedirectParams): HttpResponse {
    const { url } = params;
    if (url) {
      return {
        statusCode: this.params.statusCode || 307,
        headers: {
          Location: url,
        },
        body: JSON.stringify({
          code: this.params.statusCode || 307,
          location: url,
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          code: 500,
          error: `url is not provided to redirect`,
        }),
      };
    }
  }

  doTransformError(_cause: Error): HttpResponse {
    return {
      statusCode: 500,
      body: JSON.stringify({ code: 500, error: `Bad URL to redirect` }),
    };
  }
}
