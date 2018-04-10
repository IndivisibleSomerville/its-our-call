import * as React from 'react';
import { GoSearch, GoThreeBars } from 'react-icons/lib/go';

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
        <div className="title">
          It's Our Call
        </div>
        <div className="button-section" >
          <GoSearch className="button" onClick={this.props.handleSearchClick} />
          <GoThreeBars className="button" onClick={this.props.handleMenuClick} />
        </div>
      </div>
    );
  }
}

export default Header;
