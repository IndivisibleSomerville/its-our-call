import 'isomorphic-fetch';

import { commonReq } from './commonReq';

// tslint:disable:no-any (payload)
/**
 * Common options that we are allowed to pass into HTTP requests.
 */
export interface HttpOptions {
  /**
   * A pojo payload (JSON.stringify will be called on it internally)
   * Can be ignored depending on the method call,
   */
  payload?: any;
  /**
   * The query string that can be attached to the request.
   * e.g. '?page=2'
   */
  queryParams?: string;
  /**
   * The custom contentType passed to this request.
   * e.g. 'application/vnd.api+json', if requiring JSON API response.
   */
  contentType?: string;
}
// tslint:enable:no-any (payload)

/** A request/response pair for a single API call.  */
export interface HttpRequestResponse {
  /** The request that the Http method created internally (useful for debugging). */
  req: Request;
  /** The promise from the internal fetch call (see req). */
  resp: Promise<Response>;
}

/**
 * Class for common http calls to the backend.
 * See get(), post(), put(), patch(), and delete() to get started
 */
export default class Http {
    /**
     * A common implementation for http calls to the backend.
     * See get(), post(), put(), patch(), and delete() to get started
     */
    constructor() {
      //
    }

    /**
     * Performs an authenticated GET request and returns its promise.
     * @param url endpoint url of the request.
     * @param options other options that the request needs, e.g. the content type.
     * ignores the options.payload (get requests have no body).
     */
    public get(url: string, options: HttpOptions = {}): HttpRequestResponse {
        let req = commonReq(url, 'get', undefined, options.contentType);
        return { req, resp: fetch(req) };
    }

    /**
     * Performs an authenticated fetch request and returns its promise.
     * @param url endpoint url of the request.
     * @param options other options that the request needs, e.g. the payload.
     * Assumes json in the options.payload, will stringify it for you.
     */
    public post(url: string, options: HttpOptions = {}): HttpRequestResponse {
        if (options.payload === undefined) {
          console.warn('undefined payload for post, possible bad request');
        }
        let data = JSON.stringify( options.payload );
        let req = commonReq(url, 'post', data, options.contentType);
        return { req, resp: fetch(req) };
    }

    /**
     * All authenticated PUT requests to the backend should use this function
     * @param url endpoint url of the request.
     * @param options other options that the request needs, e.g. the payload.
     * Assumes json in the options.payload, will stringify it for you.
     */
    public put(url: string, options: HttpOptions = {}): HttpRequestResponse {
        if (options.payload === undefined) {
          console.warn('undefined payload for put, possible bad request');
        }
        let data = JSON.stringify( options.payload );
        let req = commonReq(url, 'put', data, options.contentType);
        return { req, resp: fetch(req) };
    }

    /**
     * All authenticated PATCH requests to the backend should use this function
     * @param url endpoint url of the request.
     * @param options other options that the request needs, e.g. the payload.
     * Assumes json in the options.payload, will stringify it for you
     */
    public patch(url: string, options: HttpOptions = {}): HttpRequestResponse {
        if (options.payload === undefined) {
          console.warn('undefined payload for patch, possible bad request');
        }
        let data = JSON.stringify( options.payload );
        let req = commonReq(url, 'patch', data, options.contentType);
        return { req, resp: fetch(req) };
    }

    /**
     * All authenticated DELETE requests to the backend should use this function
     * @param url endpoint url of the request.
     */
    public delete(url: string, options: HttpOptions = {}): HttpRequestResponse {
        let req = commonReq(url, 'delete', undefined, options.contentType);
        return { req, resp: fetch(req) };
    }
}
