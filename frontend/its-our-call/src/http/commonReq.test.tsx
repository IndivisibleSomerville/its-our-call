// tslint:disable:no-string-literal (helper function)
import { commonReq } from './commonReq';

describe('[unit] Http', () => {
  it('returns Request object', async() => {
    let val = commonReq('test-url', 'test-method');
    expect(val).toBeDefined();
    expect(val.url).toEqual('test-url');
    expect(val.method).toEqual('test-method');
    expect(val['headers'].get('content-type')).toEqual('application/json');
    expect(val['_bodyInit']).toBeUndefined();
    expect(val['_bodyText']).toEqual('');
  });
  it('returns Request object with optional body params', async() => {
    let val = commonReq('test-url', 'test-method', JSON.stringify({'optional': 'body params'}));
    expect(val).toBeDefined();
    expect(val.url).toEqual('test-url');
    expect(val.method).toEqual('test-method');
    expect(val['headers'].get('content-type')).toEqual('application/json');
    expect(val['_bodyInit']).toEqual(JSON.stringify({'optional': 'body params'}));
    expect(val['_bodyText']).toEqual(JSON.stringify({'optional': 'body params'}));
  });
  it('returns Request object with no body params and content type', async() => {
    let val = commonReq('test-url', 'test-method', undefined, 'custom-content-header');
    expect(val).toBeDefined();
    expect(val.url).toEqual('test-url');
    expect(val.method).toEqual('test-method');
    expect(val['headers'].get('content-type')).toEqual('custom-content-header');
    expect(val['_bodyInit']).toBeUndefined();
    expect(val['_bodyText']).toEqual('');
  });
});
