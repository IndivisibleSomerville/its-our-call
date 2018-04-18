import * as React from 'react';
import { asResourceRow, ResourceRowProps } from './ResourceRow';
import { Legislator as LegislatorData } from '../data/Legislator';
import PlusMinusButton from './PlusMinusButton';
import PartyBreakDown from './PartyBreakDown';

let placeholder = 'Legislator list. Cras vulputate, turpis site amet nisi nisi ullamcorper \
Dico adhuc oblique sit ne, id homero eripuit appetere per. Vel persecuti forensibus \
ea, te nec dicat summo. Debitis repudiare sea cu. Eos dolor consequat id, sed id \
eius summo ubique, vero euripidis mei ex. Deserunt omittantur cum ad, eam ex tempor \
vocent sanctus.';

import InfoButton from './InfoButton';

import './CollapsibleMapSection.css';

interface CollapsibleMapSectionWrappedProps extends ResourceRowProps {
  data: CollapsibleMapSectionDataProps;
}

type IconType = 'smile' | 'frown';

export interface CollapsibleMapSectionDataProps {
  title: string;
  legislators: LegislatorData[];
  icon?: IconType;
  startExpanded?: boolean;
  showInfoButton?: boolean;
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
  hasMore: boolean;
}

class CollapsibleMapSection extends React.Component<CollapsibleMapSectionWrappedProps, CollapsibleMapSectionState> {
  constructor(props: CollapsibleMapSectionWrappedProps) {
    super(props);
    this.state = {
      numRepubs: (Math.floor(Math.random() * 4 + 2)),
      numDems: (Math.floor(Math.random() * 4 + 2)),
      highlightedStates: ['MA', 'NY', 'HI', 'AK'],
      lastUpdated: '3 hours ago',
      confidencePercentage: '95%',
      // TODO: get the above values from data
      zoom: 1.0,
      hasMore: true,
      expanded: (props.data.startExpanded !== undefined ? props.data.startExpanded : true),
    };
    this.toggleMore = this.toggleMore.bind(this);
  }
  toggleMore() {
    this.setState({hasMore: !this.state.hasMore});
  }

  render() {
    let optionalIcon = (null);
    switch (this.props.data.icon) {
      case 'smile':
        optionalIcon = (<div className="icon smile">☺</div>);
        break;
      case 'frown':
        optionalIcon = (<div className="icon frown">☹</div>);
        break;
      default:
    }
    let optionalInfoButton = (null);
    if (this.props.data.showInfoButton) {
      optionalInfoButton = (<InfoButton />);
    }

    let legislatorList = (<div>{placeholder}</div>);
    return (
      <div className={'CollapsibleMapSection ' + (this.state.expanded ? 'expanded' : 'collapsed')}>
        <div className="header">
          <PlusMinusButton
            showMinus={this.state.expanded}
            onClick={() => {this.setState({expanded: !this.state.expanded}); }}
          />
          <div className="middle">
            {optionalIcon}
            <div className="title">
              {this.props.data.title}
            </div>
            {optionalInfoButton}
          </div>
          <div className="right">
            <div className="total">{this.state.numRepubs + this.state.numDems}</div>
            <PartyBreakDown r={this.state.numRepubs} d={this.state.numDems}/>
          </div>
        </div>
        <div className="content">
          <div className="topShadow">&nbsp;</div>
          <div className="map">
            map stuff
          </div>
          <div className={'overview-wrapper ' + (this.state.hasMore ? 'collapsed' : 'expanded')}>
            <div className="overview">{legislatorList}</div>
            <div className="bottomShadow">&nbsp;</div>
            <div className="toggleButton" onClick={() => {this.toggleMore(); }}>
              {this.state.hasMore ? 'more +' : 'end'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default asResourceRow(CollapsibleMapSection);
