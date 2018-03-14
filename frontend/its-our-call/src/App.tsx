import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import * as pages from './pages';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact={true} path="/" component={pages.Home}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
