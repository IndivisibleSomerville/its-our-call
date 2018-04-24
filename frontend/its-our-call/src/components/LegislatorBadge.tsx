import * as React from 'react';
import './LegislatorBadge.css';

// requires embedded svgs in the main body

export type StateAbbreviation = 'AK' | 'AL' | 'AR' | 'AZ' | 'CA' | 'CO' | 'CT' | 'DC' | 'DE' | 'FL'
  | 'GA' | 'HI' | 'IA' | 'ID' | 'IL' | 'IN' | 'KS' | 'KY' | 'LA' | 'MA' | 'MD' | 'ME' | 'MI' | 'MN'
  | 'MO' | 'MS' | 'MT' | 'NC' | 'ND' | 'NE' | 'NH' | 'NJ' | 'NM' | 'NV' | 'NY' | 'OH' | 'OK' | 'OR'
  | 'PA' | 'RI' | 'SC' | 'SD' | 'TN' | 'TX' | 'UT' | 'VA' | 'VT' | 'WA' | 'WI' | 'WV' | 'WY';

interface LegislatorBadgeProps {
  type: string;
  state: string | StateAbbreviation;
}

class LegislatorBadge extends React.Component<LegislatorBadgeProps> {
  render() {
    let undefinedPartyColor = '';
    if (this.props.type === 'dem') {
      undefinedPartyColor = 'blue';
    } else if (this.props.type === 'repub') {
      undefinedPartyColor = 'red';
    }
    let stateAbbreviation = this.props.state.substr(0, 2);
    return (
      // tslint:disable:jsx-self-close
      <div className={'LegislatorBadge ' + undefinedPartyColor}>
        <svg className={'state-icon state-icon-' + stateAbbreviation}>
          <use xlinkHref={'#icon-state-' + stateAbbreviation}></use>
        </svg>
      </div>
    );
  }
}

export default LegislatorBadge;
