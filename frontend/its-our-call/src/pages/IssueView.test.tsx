import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MemoryRouter } from 'react-router-dom';

jest.mock('../http/Http'); // this overriddes /src/http/Http with what's inside /src/http/__mocks__/Http.tsx
import IssueView from './IssueView';

it('renders without crashing', () => {
  // By default, all our http is successful with an empty response body
  const div = document.createElement('div');
  ReactDOM.render((
    <MemoryRouter initialEntries={['/legislators/1']}>
      <IssueView />
    </MemoryRouter>
  ), div);
});
