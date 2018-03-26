import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import * as pages from './pages';
import './App.css';

import Header from './components/Header';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header />
          <Switch>
            <Route exact={true} path="/" component={pages.Home}/>
            <Route exact={true} path="/issues" component={pages.IssueList}/>
            <Route exact={true} path="/issues/:id" component={pages.IssueView}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
