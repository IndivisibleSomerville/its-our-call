import * as React from 'react';

import './Header.css';
// The general global header for the web app. (a.k.a. the Nav Bar)

interface HeaderProps {
  handleSearchClick: () => void;
  handleMenuClick: () => void;
}

interface HeaderState { }

class Header extends React.Component<HeaderProps, HeaderState> {
  render() {
    // TODO: Search button, Nav Menu
    return (
      <div className="Header">
        It's Our Call
        <button className="search-button" onClick={this.props.handleSearchClick}>
          Search
        </button>
        <button className="menu-button" onClick={this.props.handleMenuClick}>
          Menu
        </button>
      </div>
    );
  }
}

export default Header;
