import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as fs from 'fs';
import { MemoryRouter } from 'react-router-dom';

import Http from '../http/Http';
import Home from './Home';
jest.mock('../http/Http'); // this overriddes /src/http/Http with what's inside /src/http/__mocks__/Http.tsx

it('renders without crashing', () => {
  // By default, all our http is successful with an empty response body
  const div = document.createElement('div');
  ReactDOM.render((
    <MemoryRouter initialEntries={['/']}>
      <Home />
    </MemoryRouter>
  ), div);
});

it('renders with some issues and legislators', () => {
  // tslint:disable-next-line:no-any
  Http.prototype.get = jest.fn().mockImplementation((url: string, options: any) => {
    // TODO: confirm the right urls were asked for
    // TODO: conditionally respond with legislator data
    let validGetResponse: Response = new Response(fs.createReadStream('../__mock_data__/issues_get_200.json'));
    return {
      // note, no need to mock the returned req field since we don't use it
      resp: new Promise<Response>((resolve, reject) => {
        resolve(validGetResponse);
      })
    };
  });

  const div = document.createElement('div');
  ReactDOM.render((
    <MemoryRouter initialEntries={['/']}>
      <Home />
    </MemoryRouter>
  ), div);
});
