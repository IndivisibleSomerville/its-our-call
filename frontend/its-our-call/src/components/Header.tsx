import * as React from 'react';

// The general global header for the web app. (a.k.a. the Nav Bar)

interface HeaderProps { }

interface HeaderState { }

class Header extends React.Component<HeaderProps, HeaderState> {
  render() {
    // TODO: Search button, Nav Menu
    return (
      <div className="Header">
        It's Our Call
      </div>
    );
  }
}

export default Header;
