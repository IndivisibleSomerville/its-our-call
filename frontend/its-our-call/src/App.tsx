import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import * as pages from './pages';
import * as urls from './pages/urls';
import './App.css';

import Header from './components/Header';
import { SearchOverlay, MainMenu } from './components';

enum Overlay {
  None,
  Search,
  Menu,
}

interface AppProps { }

interface AppState {
  overlay: Overlay;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      overlay: Overlay.None,
    };
  }

  handleSearchClick = () => {
    if (this.state.overlay === Overlay.Search) {
      this.setState({ overlay: Overlay.None });
    } else {
      this.setState({ overlay: Overlay.Search });
    }
  }

  handleMenuClick = () => {
    if (this.state.overlay === Overlay.Menu) {
      this.setState({ overlay: Overlay.None });
    } else {
      this.setState({ overlay: Overlay.Menu });
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header
            handleSearchClick={this.handleSearchClick}
            handleMenuClick={this.handleMenuClick}
            searchOpen={this.state.overlay === Overlay.Search}
            menuOpen={this.state.overlay === Overlay.Menu}
          />
          <Switch>
            <Route exact={true} path="/" component={pages.Home}/>
            <Route exact={true} path={urls.urlIssuesList()} component={pages.IssueList}/>
            <Route exact={true} path={urls.urlFmtIssueView(':id')} component={pages.IssueView}/>
            <Route exact={true} path={urls.urlLegislatorsList()} component={pages.LegislatorList}/>
            <Route exact={true} path={urls.urlFmtLegislatorView(':id')} component={pages.LegislatorView}/>
          </Switch>
          <SearchOverlay open={this.state.overlay === Overlay.Search} />
          <MainMenu
            open={this.state.overlay === Overlay.Menu}
            handleClose={this.handleMenuClick}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
