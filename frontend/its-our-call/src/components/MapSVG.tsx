import * as React from 'react';
import stateData from '../data/usa-states-dimensions';
import districtData from '../data/usa-districts-dimensions';

// subcomponent for each map area (state, district, etc).

interface MapAreaSVGProps {
  dimensions: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  state: string;
  onClickState?: (state: string) => void;
}

interface MapAreaSVGState {
}

class MapAreaSVG extends React.Component<MapAreaSVGProps, MapAreaSVGState> {
  constructor(props: MapAreaSVGProps) {
    super(props);
    this.onClickState = this.onClickState.bind(this);
  }

  onClickState() {
    if (this.props.onClickState) {
      this.props.onClickState(this.props.state);
    }
  }

  render() {
    // TODO: popover on click
    if (this.props.onClickState) {
      return (
        <path
          d={this.props.dimensions}
          fill={this.props.fill}
          stroke={this.props.stroke}
          strokeWidth={this.props.strokeWidth}
          data-name={this.props.state}
          className={`${this.props.state} state`}
          onClick={this.onClickState}
        />
      );
    }
    return (
      <path
        d={this.props.dimensions}
        fill={this.props.fill}
        stroke={this.props.stroke}
        strokeWidth={this.props.strokeWidth}
        data-name={this.props.state}
        className={`${this.props.state} state`}
      />
    );
  }
}

// end of subcomponent

// tslint:disable:no-console
interface MapSVGProps {
  width: number | string;
  height: number | string;
  mapType: 'state' | 'district';
  customize: { [key: string]: { fill?: string, stroke?: string, clickHandler?: (state: string) => void }};
  defaultFill?: string;
  defaultStroke?: string;
  onStateClick?: (state: string) => void;
}

interface MapSVGState {
  defaultFill: string;
  defaultStroke: string;
  outerStroke: string;
  viewBox: string;
  doneBuildingPaths: boolean;
  paths: JSX.Element[];
  currentQueue: number;
}

const DIMENSIONS_KEY = 'dimensions';
const VIEWBOX_KEY = 'viewBox';

const stateZoneKeys = Object.keys(stateData).filter((key: string) => { return key !== VIEWBOX_KEY; });
const districtZoneKeys = Object.keys(districtData).filter((key: string) => { return key !== VIEWBOX_KEY; });

export default class MapSVG extends React.Component<MapSVGProps, MapSVGState> {
  constructor(props: MapSVGProps) {
    super(props);
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
      doneBuildingPaths: false,
      paths: [],
      currentQueue: 0,
    };
  }

  componentDidMount() {
    let currentQueue = this.state.currentQueue + 1;
    this.setState({
      viewBox: this.buildViewBox(this.props.mapType === 'state'),
      paths: [],
      currentQueue,
      doneBuildingPaths: false
    });
  }

  componentWillReceiveProps(props: MapSVGProps) {
    let currentQueue = this.state.currentQueue + 1;
    this.setState({
      viewBox: this.buildViewBox(props.mapType === 'state'),
      paths: [],
      currentQueue,
      doneBuildingPaths: false,
    });
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

  zoneFillColor(zoneKey: string): string {
    if (this.props.customize[zoneKey]) {
      let safeFill: string | undefined = this.props.customize[zoneKey].fill;
      if (safeFill) {
        return safeFill;
      }
    }
    return this.state.defaultFill;
  }
  zoneStrokeColor(zoneKey: string): string {
    if (this.props.customize[zoneKey]) {
      let safeStroke: string | undefined = this.props.customize[zoneKey].stroke;
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
    let zoneData = this.props.mapType === 'state' ? stateZoneKeys : districtZoneKeys;
    let dimensionData = this.props.mapType === 'state' ? stateData : districtData;

    return (
      <svg
        className="us-map"
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width}
        height={this.props.height}
        viewBox={this.state.viewBox}
      >
        <g className="bg" fill="#F2F2F2" stroke={this.state.outerStroke} strokeWidth="4">
          <use xlinkHref={this.props.mapType === 'state' ? '#state-map-outline' : '#district-map-outline'} />
        </g>
        <g className="outlines">
          {zoneData.map((zoneKey: string) => {
            return (
              <MapAreaSVG
                key={zoneKey}
                dimensions={dimensionData[zoneKey][DIMENSIONS_KEY]}
                state={zoneKey}
                strokeWidth={2}
                stroke={this.zoneStrokeColor(zoneKey)}
                fill={this.zoneFillColor(zoneKey)}
                onClickState={this.stateClickHandler}
              />
            );
          })}
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
