import * as React from 'react';
import { Legislator as LegislatorData } from '../data/Legislator';
import PlusMinusButton from './PlusMinusButton';
import PartyBreakDown from './PartyBreakDown';
// import MapComponent from './MapSVG';
import MapComponent from './MapD3';
import LegislatorRow, { LegislatorRowDataProps } from '../components/LegislatorRow';

import InfoButton from './InfoButton';

import './CollapsibleMapSection.css';

interface CollapsibleMapSectionWrappedProps {
  data: CollapsibleMapSectionDataProps;
}

type IconType = 'smile' | 'frown';
type MapType = 'state' | 'district';

export interface CollapsibleMapSectionDataProps {
  title: string;
  legislators: LegislatorData[];
  legislatorRowProps: LegislatorRowDataProps[];
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
  customizedMapZones: { [key: string]: { fill?: string, stroke?: string, clickHandler?: (state: string) => void }};
  lastUpdated: string;
  confidencePercentage: string;
  zoom: number;
  isExpanded: boolean;
  isLoaded: boolean;
}

class CollapsibleMapSection extends React.Component<CollapsibleMapSectionWrappedProps, CollapsibleMapSectionState> {
  constructor(props: CollapsibleMapSectionWrappedProps) {
    super(props);
    this.updateStateFromProps = this.updateStateFromProps.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
    this.buildMap = this.buildMap.bind(this);
    this.buildLegislatorRows = this.buildLegislatorRows.bind(this);
    this.buildOptionalIcon = this.buildOptionalIcon.bind(this);
    // TODO: calculate from real data
    this.state = {
      numRepubs: 0,
      numDems: 0,
      customizedMapZones: {},
      isLoaded: false,
      lastUpdated: '3 hours ago',
      confidencePercentage: '95%',
      zoom: 1.0,
      isExpanded: false,
      expanded: (props.data.startExpanded === true),
    };
  }
  componentDidMount() {
    this.setState({ isExpanded: false, isLoaded: false });
    this.updateStateFromProps(this.props);
  }
  componentWillReceiveProps(props: CollapsibleMapSectionWrappedProps) {
    this.setState({ isExpanded: false, isLoaded: false });
    this.updateStateFromProps(props);
  }
  updateStateFromProps(props: CollapsibleMapSectionWrappedProps) {
    let numRepubs = 0;
    let numDems = 0;
    let customizedMapZones = {};
    props.data.legislators.forEach((l: LegislatorData) => {
      numRepubs = numRepubs + (l.partyAffiliation === 'repub' ? 1 : 0);
      numDems = numDems + (l.partyAffiliation === 'dem' ? 1 : 0);
      customizedMapZones[l.districtCode] = {fill: '#FFFFFF', stroke: '#C9C9C9'};
    });
    this.setState({
      numRepubs,
      numDems,
      customizedMapZones,
      isLoaded: true,
    });
  }

  toggleExpanded() {
    this.setState({isExpanded: !this.state.isExpanded});
  }

  buildOptionalIcon() {
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
    return optionalIcon;
  }

  buildMap(): JSX.Element | null {
    if (this.props.data.mapType === undefined) {
      return (null);
    }
    return (
      <div className="map-and-details">
        <div className="topShadow">&nbsp;</div>
        <div className="map">
          <MapComponent
            width={'95%'}
            height={'95%'}
            mapType={this.props.data.mapType}
            customize={this.state.customizedMapZones}
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
      </div>
    );
  }

  buildLegislatorRows(): JSX.Element {
    let truncatedLegislatorRowProps = () => {
      if (this.state.isExpanded) {
        return this.props.data.legislatorRowProps;
      }
      return this.props.data.legislatorRowProps.slice(0, 5);
    };
  
    let toRet = (<div className="overview empty">[no legislators have this stance]</div>);
    if (truncatedLegislatorRowProps().length > 0) {
      toRet = (
        <div className={'overview-wrapper ' + (this.state.isExpanded ? 'expanded' : 'collapsed')}>
          <div className="overview">
            {truncatedLegislatorRowProps().map((l: LegislatorRowDataProps, indx: number) => {
                return (<LegislatorRow key={indx} data={l}/>);
            })}
          </div>
          <div className="bottomShadow">&nbsp;</div>
          <div className="toggleButton" onClick={() => {this.toggleExpanded(); }}>
            {this.state.isExpanded ? 'hide' : 'more +'}
          </div>
        </div>
      );
    }
    return toRet;
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div className={'CollapsibleMapSection loaded'}>
          Loading...
        </div>
      );
    }

    return (
      <div className={'CollapsibleMapSection ' + (this.state.expanded ? 'expanded' : 'collapsed')}>
        <div className="header">
          <PlusMinusButton
            showMinus={this.state.expanded}
            onClick={() => {this.setState({expanded: !this.state.expanded}); }}
          />
          <div className="middle">
            {this.buildOptionalIcon()}
            <div className="title">
              {this.props.data.title}
            </div>
            {this.props.data.showInfoButton ? <InfoButton /> : (null)}
          </div>
          <div className="right">
            <div className="total">{this.state.numRepubs + this.state.numDems}</div>
            <PartyBreakDown r={this.state.numRepubs} d={this.state.numDems}/>
          </div>
        </div>
        <div className="content">
          {this.buildMap()}
          {this.buildLegislatorRows()}
        </div>
      </div>
    );
  }
}

export default CollapsibleMapSection;
