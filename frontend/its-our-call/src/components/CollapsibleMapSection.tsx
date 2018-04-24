import * as React from 'react';
import { asResourceRow, ResourceRowProps } from './ResourceRow';
import { Legislator as LegislatorData } from '../data/Legislator';
import PlusMinusButton from './PlusMinusButton';
import PartyBreakDown from './PartyBreakDown';
import MapSVG from './MapSVG';
import LegislatorRow, { LegislatorRowDataProps, mapDataToLegislatorRowDataProps } from '../components/LegislatorRow';

import InfoButton from './InfoButton';

import './CollapsibleMapSection.css';

interface CollapsibleMapSectionWrappedProps extends ResourceRowProps {
  data: CollapsibleMapSectionDataProps;
}

type IconType = 'smile' | 'frown';
type MapType = 'state' | 'district';

export interface CollapsibleMapSectionDataProps {
  title: string;
  legislators: LegislatorData[];
  lastUpdated: string;
  confidencePercentage: string;
  mapType?: MapType;
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
  // zone-by-zone breakdown (states or districts)
  mapType: MapType;
  highlightedMapZones: string[];
  lastUpdated: string;
  confidencePercentage: string;
  zoom: number;
  isExpanded: boolean;
  legislatorRowProps: LegislatorRowDataProps[];
}

// TODO: remove these when we're done with the demos
import stateData from '../data/usa-states-dimensions';
let stateDataKeys = Object.keys(stateData); // ['MA', 'CA', 'MT', ...]
let randomStates = (): string[] => {
  return stateDataKeys.filter(() => {
    return Math.random() < .2;
  });
};

import districtData from '../data/usa-districts-dimensions';
let districtDataKeys = Object.keys(districtData); // ['MA_1', 'MA_10', 'CA_40', 'MT_At-Large', ...]
let randomDistricts = (): string[] => {
  return districtDataKeys.filter(() => {
    return Math.random() < .2;
  });
};

class CollapsibleMapSection extends React.Component<CollapsibleMapSectionWrappedProps, CollapsibleMapSectionState> {
  constructor(props: CollapsibleMapSectionWrappedProps) {
    super(props);
    // TODO: calculate from real data
    this.state = {
      numRepubs: props.data.legislators.reduce((count: number, l: LegislatorData) => {
        count = count + (l.partyAffiliation === 'repub' ? 1 : 0);
        return count;
      }, 0),
      numDems: props.data.legislators.reduce((count: number, l: LegislatorData) => {
        count = count + (l.partyAffiliation === 'dem' ? 1 : 0);
        return count;
      }, 0),
      highlightedMapZones: (props.data.mapType === 'district') ? randomDistricts() : randomStates(),
      lastUpdated: '3 hours ago',
      confidencePercentage: '95%',
      zoom: 1.0,
      isExpanded: true,
      mapType: props.data.mapType === 'district' ? 'district' : 'state',
      expanded: (props.data.startExpanded === true),
      legislatorRowProps: props.data.legislators.map(mapDataToLegislatorRowDataProps)
    };
    this.toggleMore = this.toggleMore.bind(this);
    this.buildOverviewContent = this.buildOverviewContent.bind(this);
  }
  toggleMore() {
    this.setState({isExpanded: !this.state.isExpanded});
  }

  componentWillReceiveProps(props: CollapsibleMapSectionWrappedProps) {
      this.setState({
         mapType: props.data.mapType === 'district' ? 'district' : 'state',
         highlightedMapZones: (props.data.mapType === 'district') ? randomDistricts() : randomStates(),
      });
  }

  buildOverviewContent() {
    let overviewWrapperClasses = 'overview-wrapper ' + (this.state.isExpanded ? 'expanded' : 'collapsed' );
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
          {this.state.isExpanded ? 'hide' : 'more +'}
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
              mapType={this.state.mapType}
              customize={this.state.highlightedMapZones.reduce((previousValue, stateKey: string) => {
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
