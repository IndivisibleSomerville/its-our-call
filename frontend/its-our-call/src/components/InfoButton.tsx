import * as React from 'react';
import './InfoButton.css';

interface InfoButtonProps {

}

interface InfoButtonState {

}

class InfoButton extends React.Component<InfoButtonProps, InfoButtonState> {
  constructor(props: InfoButtonProps) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="InfoButton">﹖</div>
    );
  }
}

export default InfoButton;
