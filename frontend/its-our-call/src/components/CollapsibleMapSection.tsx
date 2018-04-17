import * as React from 'react';
import { Link } from 'react-router-dom';
import { asResourceRow, ResourceRowProps } from './ResourceRow';
import { Legislator as LegislatorData } from '../data/Legislator';

import InfoButton from './InfoButton';

import './CollapsibleMapSection.css';

interface CollapsibleMapSectionWrappedProps extends ResourceRowProps {
  data: CollapsibleMapSectionDataProps;
}

export interface CollapsibleMapSectionDataProps {
  startExpanded?: boolean;
  legislators: LegislatorData[];
}

interface CollapsibleMapSectionState {
  // TODO: calculate actual state from props
  expanded: boolean;
  // party breakdown
  numRepubs: number;
  numDems: number;
  // state-by-state breakdown
  highlightedStates: string[];
  lastUpdated: string;
  confidencePercentage: string;
  zoom: number;
}

class CollapsibleMapSection extends React.Component<CollapsibleMapSectionWrappedProps, CollapsibleMapSectionState> {
  constructor(props: CollapsibleMapSectionWrappedProps) {
    super(props);
    this.state = {
      numRepubs: (Math.random() * 4 + 2),
      numDems: (Math.random() * 4 + 2),
      highlightedStates: ['MA', 'NY', 'HI', 'AK'],
      lastUpdated: '3 hours ago',
      confidencePercentage: '95%',
      // TODO: get the above values from data
      zoom: 1.0,
      expanded: (props.data.startExpanded !== undefined ? props.data.startExpanded : true),
    };
  }

  render() {
    return (
      <div className={'CollapsibleMapSection ' + this.state.expanded ? 'expanded' : 'collapsed'}>
        <div className="header">
          <div className="expand-button">
            +
          </div>
          <div className="title">
            Uncommitted
          </div>
          <div className="right">
            14 R:5 D:9
          </div>
        </div>
        <div className="content">
          <div className="title">
            <Link to={'#'}>
              Support the Pidgeon Recognition Act
            </Link>
          </div>
          <div className="vote-deadline">
            senate vote in 11 days
          </div>
          <div className="needed-votes">
            <div className="bold">6</div>
            <div className="desc">more yeas needed</div>
          </div>
          <div className="confidence">
            <div className="bold">our confidence:</div>
            <div className="percent">95%</div>
            <InfoButton />
          </div>
        </div>
      </div>
    );
  }
}

export default asResourceRow(CollapsibleMapSection);
