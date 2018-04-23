import * as React from 'react';
import MapAreaSVG from './MapAreaSVG';
import stateData from '../data/usa-states-dimensions';
import districtData from '../data/usa-districts-dimensions';

// tslint:disable:no-console
interface MapSVGProps {
  width: number | string;
  height: number | string;
  mapType: 'state' | 'district';
  customize?: { [key: string]: { fill?: string, stroke?: string, clickHandler?: (state: string) => void }};
  defaultFill?: string;
  defaultStroke?: string;
  onStateClick?: (state: string) => void;
}

interface MapSVGState {
  defaultFill: string;
  defaultStroke: string;
  outerStroke: string;
  viewBox: string;
}

const DIMENSIONS_KEY = 'dimensions';
const VIEWBOX_KEY = 'viewBox';
export default class MapSVG extends React.Component<MapSVGProps, MapSVGState> {
  constructor(props: MapSVGProps) {
    super(props);
    this.buildPaths = this.buildPaths.bind(this);
    this.zoneFillColor = this.zoneFillColor.bind(this);
    this.zoneStrokeColor = this.zoneStrokeColor.bind(this);
    this.stateClickHandler = this.stateClickHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.buildStateCircles = this.buildStateCircles.bind(this);
    this.buildViewBox = this.buildViewBox.bind(this);
    this.state = {
      defaultFill: props.defaultFill ? props.defaultFill : 'rgba(0,0,0,0)',
      defaultStroke: props.defaultStroke ? props.defaultStroke : 'rgba(0,0,0,0)',
      outerStroke: '#C9C9C9',
      viewBox: this.buildViewBox(this.props.mapType === 'state'),
    };
  }

  buildPaths(outline?: boolean, strokeWidth?: number) {
    let zoneData = this.props.mapType === 'state' ? stateData : districtData;
    let zoneKeys = Object.keys(zoneData).filter((key: string) => { return key !== VIEWBOX_KEY; });
    return zoneKeys.map(
      (zoneKey: string) => {
      return (
        <MapAreaSVG
          key={outline ? ('outline_' + zoneKey) : zoneKey}
          dimensions={zoneData[zoneKey][DIMENSIONS_KEY]}
          state={zoneKey}
          strokeWidth={strokeWidth ? strokeWidth : 2}
          stroke={outline ? '#FFFFFF' : this.zoneStrokeColor(zoneKey)}
          fill={outline ? '#FFFFFF' : this.zoneFillColor(zoneKey)}
          onClickState={outline ? (s: string) => { /* no-op */ } : this.stateClickHandler}
        />
      );
    });
  }

  componentWillReceiveProps(props: MapSVGProps) {
    this.setState({viewBox: this.buildViewBox(props.mapType === 'state')});
  }

  buildViewBox(isStateMap: boolean): string {
    if (isStateMap) {
      // we need to pad the width of the state map since we're adding state circle shapes
      let stateDimensions = stateData[VIEWBOX_KEY].split(' ');
      stateDimensions[2] = `${1100}`;
      return stateDimensions.join(' ');
    }
    return districtData[VIEWBOX_KEY];
  }

  zoneFillColor(state: string): string {
    if (this.props.customize && this.props.customize[state]) {
      let safeFill: string | undefined = this.props.customize[state].fill;
      if (safeFill) {
        return safeFill;
      }
    }
    return this.state.defaultFill;
  }
  zoneStrokeColor(state: string): string {
    if (this.props.customize && this.props.customize[state] && this.props.customize[state].stroke) {
      let safeStroke: string | undefined = this.props.customize[state].stroke;
      if (safeStroke) {
        return safeStroke;
      }
    }
    return this.state.defaultStroke;
  }

  stateClickHandler(state: string) {
    if (this.props.customize && this.props.customize[state] && this.props.customize[state].clickHandler) {
      return this.props.customize[state].clickHandler;
    }
    return this.clickHandler;
  }

  clickHandler(state: string) {
    if (this.props.onStateClick) {
      this.props.onStateClick(state);
    }
  }

  buildStateCircles() {
    if (this.props.mapType !== 'state') {
      return;
    }
    let smallStates = ['VT', 'NH', 'MA', 'RI', 'CT', 'NJ', 'DE', 'MD', 'DC'];
    let radius = 35;
    let circleY = 185;
    let textYOffset = 15;
    let yStep = 45;
    let leftX = 915;
    let rightX = 995;
    return smallStates.map((stateAbbreviation: string, indx: number) => {
      // odd # items on the right, evens on the left
      let rightColumn = (((indx + 1) % 2) === 1);
      return (
        <g key={indx} className={'state-label ' + stateAbbreviation}>
          <circle
            data-name={stateAbbreviation}
            fill={this.zoneFillColor(stateAbbreviation)}
            stroke={this.state.outerStroke}
            strokeWidth="3"
            cx={rightColumn ? rightX : leftX}
            cy={circleY + yStep * indx}
            r={radius}
            opacity="1"
          />
          <text
            textAnchor="middle"
            fontSize="35"
            fontWeight="500"
            letterSpacing="1"
            x={rightColumn ? rightX : leftX}
            y={circleY + textYOffset + yStep * indx}
          >
            {stateAbbreviation}
          </text>
        </g>
      );
    });
  }

  render() {
    // "0 0 1100 593"
    return (
      <svg
        className="us-map"
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width}
        height={this.props.height}
        viewBox={this.state.viewBox}
      >
        <defs>
          <mask id="mask2">
            {this.buildPaths(true, 6)}
          </mask>
          <mask id="mask1">
            {this.buildPaths(true, 3)}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill={this.state.outerStroke} mask="url(#mask2)" />
        <rect width="100%" height="100%" fill={'#F2F2F2'} mask="url(#mask1)" />
        <g className="outlines">
          {this.buildPaths()}
          <g className="DC state">
            <path
              className="DC1"
              fill={this.zoneFillColor('DC1')}
              stroke={this.zoneStrokeColor('DC1')}
              d="M801.8,253.8 l-1.1-1.6 -1-0.8 1.1-1.6 2.2,1.5z"
            />
            <circle
              className="DC2"
              onClick={() => { this.stateClickHandler('DC'); }}
              data-name={'DC'}
              fill={this.zoneFillColor('DC')}
              stroke={this.zoneStrokeColor('DC')}
              strokeWidth="1.5"
              cx="801.3"
              cy="251.8"
              r="5"
              opacity="1"
            />
          </g>
          {this.buildStateCircles()}
        </g>
      </svg>
    );
  }
}
