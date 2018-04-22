import * as React from 'react';
import { asResourceRow, ResourceRowProps } from './ResourceRow';
import { Legislator as LegislatorData } from '../data/Legislator';
import PlusMinusButton from './PlusMinusButton';
import PartyBreakDown from './PartyBreakDown';
import MapSVG from './MapSVG';
import LegislatorRow, { LegislatorRowDataProps } from '../components/LegislatorRow';

import InfoButton from './InfoButton';

import './CollapsibleMapSection.css';

const stateAbbrevs = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN',
    'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
    'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

interface CollapsibleMapSectionWrappedProps extends ResourceRowProps {
  data: CollapsibleMapSectionDataProps;
}

type IconType = 'smile' | 'frown';

export interface CollapsibleMapSectionDataProps {
  title: string;
  legislators: LegislatorData[];
  lastUpdated: string;
  confidencePercentage: string;
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
  legislatorRowProps: LegislatorRowDataProps[];
}

let randomStates = (): string[] => {
  return stateAbbrevs.filter(() => {
    return Math.random() < .2;
  });
};

class CollapsibleMapSection extends React.Component<CollapsibleMapSectionWrappedProps, CollapsibleMapSectionState> {
  constructor(props: CollapsibleMapSectionWrappedProps) {
    super(props);
    // TODO: calculate from real data
    this.state = {
      numRepubs: (Math.floor(Math.random() * 4 + 2)),
      numDems: (Math.floor(Math.random() * 4 + 2)),
      highlightedStates: randomStates(),
      lastUpdated: '3 hours ago',
      confidencePercentage: '95%',
      zoom: 1.0,
      hasMore: true,
      expanded: (props.data.startExpanded !== undefined ? props.data.startExpanded : true),
      legislatorRowProps: props.data.legislators.map((l: LegislatorData) => {
        return {
          // TODO: more data mapping to props (or just let the Legislator Data handle all data)
          callLink: '#phoneNumber',
          isBookmarkRow: true,
        };
      })
    };
    this.toggleMore = this.toggleMore.bind(this);
    this.buildOverviewContent = this.buildOverviewContent.bind(this);
  }
  toggleMore() {
    this.setState({hasMore: !this.state.hasMore});
  }

  buildOverviewContent() {
    let overviewWrapperClasses = 'overview-wrapper ' + (this.state.hasMore ? 'collapsed' : 'expanded');
    if (this.state.legislatorRowProps.length === 0) {
      return (
        <div className={overviewWrapperClasses}>
          <div className="overview empty">[no legislators have this stance]</div>
        </div>
      );
    }
    return (
      <div className={overviewWrapperClasses}>
        <div className="overview">
          {
            this.state.legislatorRowProps.map((l: LegislatorRowDataProps, indx: number) => {
              return (<LegislatorRow key={indx} data={l}/>);
            })
          }
        </div>
        <div className="bottomShadow">&nbsp;</div>
        <div className="toggleButton" onClick={() => {this.toggleMore(); }}>
          {this.state.hasMore ? 'more +' : 'hide'}
        </div>
      </div>
    );
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
            <MapSVG
              width={'95%'}
              height={'95%'}
              customize={this.state.highlightedStates.reduce((previousValue, stateKey: string) => {
                previousValue[stateKey] = {fill: '#FFFFFF', stroke: '#C9C9C9'};
                return previousValue;
              }, {})}
            />
          </div>
          <div className="map-details">
            <div className="left">
              <div className="confidence">
                our confidence: {this.props.data.confidencePercentage}
              </div>
               <InfoButton />
              <div className="last-update">
                last update: {this.props.data.lastUpdated}
              </div>
            </div>
          </div>
          {this.buildOverviewContent()}
        </div>
      </div>
    );
  }
}

export default asResourceRow(CollapsibleMapSection);
