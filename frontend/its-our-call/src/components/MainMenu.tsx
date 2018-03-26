import * as React from 'react';

interface  MainMenuProps {
  hidden: boolean;
}

interface MainMenuState { }

class MainMenu extends React.Component<MainMenuProps, MainMenuState> {
  render() {
    return (
      // TODO make this actually an overlay
      <div className="menu" hidden={this.props.hidden}>
      [Main menu]
      </div>
    );
  }
}

export default MainMenu;
