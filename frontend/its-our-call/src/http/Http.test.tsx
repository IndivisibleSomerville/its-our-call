import Http from './Http';

describe('[unit] Http', () => {
  it('declarable without crashing', () => {
    let val = new Http();
    expect(val).toBeDefined();
  });
});
