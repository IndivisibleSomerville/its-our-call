import * as React from 'react';

import './PartyBreakDown.css';

interface PartyBreakDownProps {
  r: number;
  d: number;
}

class PartyBreakDown extends React.Component<PartyBreakDownProps> {
  render() {
    return (
      <div className="PartyBreakDown">
        <div className="R">R:{this.props.r}</div><div className="D">D:{this.props.d}</div>
      </div>
    );
  }
}

export default PartyBreakDown;
