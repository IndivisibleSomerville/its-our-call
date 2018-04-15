import * as React from 'react';
import { Link } from 'react-router-dom';
import * as urls from '../pages/urls';
import './MainMenu.css';

interface MenuLinkProps {
  to: string;
  text: string;
  handleClick: () => void;
}

const MenuLink: React.SFC<MenuLinkProps> = (props) => {
  return (
    <div className="menu-link">
      <Link to={props.to} onClick={props.handleClick}>{props.text}</Link>
    </div>
  );
};

interface  MainMenuProps {
  open: boolean;
  handleClose: () => void;
}

interface MainMenuState { }

class MainMenu extends React.Component<MainMenuProps, MainMenuState> {
  render() {
    const handleClose = this.props.handleClose;
    return (
      <div className={'MainMenu' + (this.props.open ? ' open' : '')}>
        <div className="head">
          <button className="close-button" onClick={handleClose}>X</button>
        </div>
        <MenuLink to="/" text="Home" handleClick={handleClose} />
        <MenuLink to={urls.urlIssuesList()} text="Issue List" handleClick={handleClose} />
        <MenuLink to={urls.urlLegislatorsList()} text="Legislator List" handleClick={handleClose} />
        <MenuLink to={urls.urlAbout()} text="About" handleClick={handleClose} />
      </div>
    );
  }
}

export default MainMenu;
