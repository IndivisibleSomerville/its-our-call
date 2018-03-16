import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
jest.mock('./http/Http'); // this overriddes /src/http/Http with what's inside /src/http/__mocks__/Http.tsx

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
