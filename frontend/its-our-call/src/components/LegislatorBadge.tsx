import * as React from 'react';
import './LegislatorRow.css';

interface LegislatorBadgeProps {
  /** Supported values: 'dem', 'repub', undefined */
  type?: string;
}

class LegislatorBadge extends React.Component<LegislatorBadgeProps> {
  render() {
    let undefinedPartyColor = '⚪️';
    if (this.props.type === 'dem') {
      undefinedPartyColor = '🔵';
    } else if (this.props.type === 'repub') {
      undefinedPartyColor = '🔴';
    }
    return (
      <div className="LegislatorBadge">
        {undefinedPartyColor}
      </div>
    );
  }
}

export default LegislatorBadge;
