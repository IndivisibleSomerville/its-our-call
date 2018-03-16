import 'isomorphic-fetch';

// tslint:disable:no-any (helper function)
/**
 * Pretty much every parseable request made to the backend will have the following components:
 * Json for content type. (might need to change this to application/vnd.api+json for JSON API)
 * very open accept headers. (ideally every return request should be json)
 * @param url The api backend url ('/api/users/me')
 * @param m The api method ('GET')
 * @param body Optional request body (Assumed serialized json)
 * @param contentType Optional contentType (Assumed application/json)
 * @return a new Request with the passed url, method, and body.
 */
export function commonReq(url: string, m: string, body?: any, contentType?: string): Request {
  contentType = (contentType === undefined) ? 'application/json' : contentType;
// tslint:enable:no-any (helper function)
  if (body !== undefined) {
    return new Request(url, {
      method: m,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': contentType,
      },
      body: body,
    });
  }
  return new Request(url, {
    method: m,
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': contentType,
    },
  });
}
