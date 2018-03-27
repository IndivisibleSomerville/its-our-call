import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import * as pages from './pages';
import './App.css';

import Header from './components/Header';

import * as urls from './pages/urls';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header />
          <Switch>
            <Route exact={true} path="/" component={pages.Home}/>
            <Route exact={true} path={urls.urlIssuesList()} component={pages.IssueList}/>
            <Route exact={true} path={urls.urlFmtIssueView(':id')} component={pages.IssueView}/>
            <Route exact={true} path={urls.urlLegislatorsList()} component={pages.LegislatorList}/>
            <Route exact={true} path={urls.urlFmtLegislatorView(':id')} component={pages.LegislatorView}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
