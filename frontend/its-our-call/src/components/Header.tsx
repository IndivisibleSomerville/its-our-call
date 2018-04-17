import * as React from 'react';
import { Link } from 'react-router-dom';
import { GoSearch, GoThreeBars } from 'react-icons/lib/go';

import './Header.css';
// The general global header for the web app. (a.k.a. the Nav Bar)

interface HeaderProps {
  handleSearchClick: () => void;
  handleMenuClick: () => void;
  searchOpen: boolean;
  menuOpen: boolean;
}

interface HeaderState { }

class Header extends React.Component<HeaderProps, HeaderState> {
  render() {
    let otherClasses = '';
    if (this.props.searchOpen) {
      otherClasses += ' searchOpen';
    }
    if (this.props.menuOpen) {
      otherClasses += ' menuOpen';
    }

    return (
      <div className={'Header' + otherClasses}>
        <div className="title">
          <Link to="/">It's Our Call</Link>
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
