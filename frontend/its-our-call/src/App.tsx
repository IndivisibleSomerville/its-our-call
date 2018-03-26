import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import * as pages from './pages';
import './App.css';

import Header from './components/Header';
import { SearchOverlay, MainMenu } from './components';

interface AppProps { }

interface AppState {
  searchHidden: boolean;
  menuHidden: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchHidden: true,
      menuHidden: true,
    };
  }

  handleSearchClick = () => {
    this.setState({
      searchHidden: !this.state.searchHidden,
      menuHidden: true,
    });
  }

  handleMenuClick = () => {
    this.setState({
      searchHidden: true,
      menuHidden: !this.state.menuHidden,
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Header
            handleSearchClick={this.handleSearchClick}
            handleMenuClick={this.handleMenuClick}
          />
          <Switch>
            <Route exact={true} path="/" component={pages.Home}/>
          </Switch>
          <SearchOverlay hidden={this.state.searchHidden} />
          <MainMenu hidden={this.state.menuHidden} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
