import * as React from 'react';
import { FaPlus as PlusIcon, FaMinus as MinusIcon } from 'react-icons/lib/fa/';
// import { GoPlus as PlusIcon, GoMinus as MinusIcon } from 'react-icons/lib/go/';

import './PlusMinusButton.css';

interface PlusMinusButtonProps {
  onClick: () => void;
  showMinus: boolean;
}

class PlusMinusButton extends React.Component<PlusMinusButtonProps> {
  render() {
    let currentIcon = (<PlusIcon />);
    if (this.props.showMinus) {
      currentIcon = (<MinusIcon />);
    }
    return (
        <div
          className={'PlusMinusButton ' + (this.props.showMinus ? 'minus' : 'plus')}
          onClick={this.props.onClick}
        >
          {currentIcon}
        </div>
    );
  }
}

export default PlusMinusButton;
