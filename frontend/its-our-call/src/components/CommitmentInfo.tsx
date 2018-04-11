import * as React from 'react';
import './CommitmentInfo.css';

type Commitment = 'yea' | 'nay' | 'uncommitted';
type ColorClass = 'success' | 'failure' | 'uncommitted';

interface CommitmentInfoProps {
  desiredType?: Commitment;
  actualType?: Commitment;
}

interface CommitmentInfoState {
  symbol: string;
  text: string;
  colorClass: ColorClass;
}

class CommitmentInfo extends React.Component<CommitmentInfoProps, CommitmentInfoState> {
  constructor(props: CommitmentInfoProps) {
    super(props);
    let symbol = '';
    let text = 'uncommitted';
    let colorClass: ColorClass = 'uncommitted';
    if (props.desiredType !== undefined && props.actualType !== undefined) {
      if (props.desiredType !== props.actualType) {
        symbol = '☹';
        colorClass = 'failure';
      } else {
        symbol = '☺';
        colorClass = 'success';
      }
    }
    if (props.actualType === 'uncommitted') {
      symbol = '';
      colorClass = 'uncommitted';
    }

    this.state = {
      symbol, text, colorClass
    };
  }

  render() {
    return (
      <div className={'CommitmentInfo ' + this.state.colorClass}>
        <div className="symbol">{this.state.symbol}</div>
        <div className="text">{this.state.text}</div>
      </div>
    );
  }
}

export default CommitmentInfo;
