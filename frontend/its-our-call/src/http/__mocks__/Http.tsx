// Mock the common http calls all in one place (no need for pretender or anything like that).
import 'isomorphic-fetch';

import { HttpOptions, HttpRequestResponse } from '../../http/Http';

// NOTE: By default we don't expect ANYTHING IN ANY OF THE RESPONSES
// Use __mock_data__ and jest locally for more complicated data.
let happyPathGetResponse = new Response('', { 'status' : 200});
let happyPathPostResponse = new Response('', { 'status' : 201});
let happyPathPutResponse = new Response('', { 'status' : 204});
let happyPathDeleteResponse = new Response('', { 'status' : 204});
// tslint:disable-next-line:no-any (helper function)
function commonReq(url: string, m: string, body?: any, contentType?: string): Request {
  if (body !== undefined && m !== 'get') {
    return new Request(url, {
      method: m,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': (contentType ? contentType : 'application/json')
      },
      body: body,
    });
  }
  return new Request(url, {
    method: m,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': (contentType ? contentType : 'application/json')
    },
  });
}

export default class Http {
    public get(url: string, options: HttpOptions): HttpRequestResponse {
        let resp = new Promise<Response>((resolve, reject) => { resolve(happyPathGetResponse); });
        return {
          req: commonReq(url, 'get'),
          resp
        };
    }
    public post(url: string, options: HttpOptions): HttpRequestResponse {
        let resp = new Promise<Response>((resolve, reject) => { resolve(happyPathPostResponse); });
        return  {
          req: commonReq(url, 'post'),
          resp
        };
    }
    public put(url: string, options: HttpOptions): HttpRequestResponse {
        let resp = new Promise<Response>((resolve, reject) => { resolve(happyPathPutResponse); });
        return {
          req: commonReq(url, 'put'),
          resp
        };
    }
    public delete(url: string, options: HttpOptions): HttpRequestResponse {
        let resp = new Promise<Response>((resolve, reject) => { resolve(happyPathDeleteResponse); });
        return {
          req: commonReq(url, 'delete'),
          resp
        };
    }
}
