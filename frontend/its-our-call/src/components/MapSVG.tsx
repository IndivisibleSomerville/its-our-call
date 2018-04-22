import * as React from 'react';
import USAStateSVG from './USAStateSVG';
import stateData from '../data/usa-states-dimensions';

// tslint:disable:no-console
interface MapSVGProps {
  width: number | string;
  height: number | string;
  customize?: { [key: string]: { fill?: string, stroke?: string, clickHandler?: (state: string) => void }};
  defaultFill?: string;
  defaultStroke?: string;
  onStateClick?: (state: string) => void;
}

interface MapSVGState {
  defaultFill: string;
  defaultStroke: string;
  outerStroke: string;
}

const DIMENSIONS_KEY = 'dimensions';
export default class MapSVG extends React.Component<MapSVGProps, MapSVGState> {
  constructor(props: MapSVGProps) {
    super(props);
    this.buildPaths = this.buildPaths.bind(this);
    this.stateFillColor = this.stateFillColor.bind(this);
    this.stateStrokeColor = this.stateStrokeColor.bind(this);
    this.stateClickHandler = this.stateClickHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.buildStateCircles = this.buildStateCircles.bind(this);
    this.state = {
      defaultFill: props.defaultFill ? props.defaultFill : 'rgba(0,0,0,0)',
      defaultStroke: props.defaultStroke ? props.defaultStroke : 'rgba(0,0,0,0)',
      outerStroke: '#C9C9C9',
    };
    console.log(stateData);
  }

  buildPaths(outline?: boolean, strokeWidth?: number) {
    return Object.keys(stateData).map((stateKey: string) => {
      return (
        <USAStateSVG
          key={outline ? ('outline_' + stateKey) : stateKey}
          dimensions={stateData[stateKey][DIMENSIONS_KEY]}
          state={stateKey}
          strokeWidth={strokeWidth ? strokeWidth : 2}
          stroke={outline ? '#FFFFFF' : this.stateStrokeColor(stateKey)}
          fill={outline ? '#FFFFFF' : this.stateFillColor(stateKey)}
          onClickState={outline ? (s: string) => { /* no-op */ } : this.stateClickHandler}
        />
      );
    });
  }

  stateFillColor(state: string): string {
    if (this.props.customize && this.props.customize[state]) {
      let safeFill: string | undefined = this.props.customize[state].fill;
      if (safeFill) {
        return safeFill;
      }
    }
    return this.state.defaultFill;
  }
  stateStrokeColor(state: string): string {
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
            fill={this.stateFillColor(stateAbbreviation)}
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
    return (
      <svg
        className="us-state-map"
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width}
        height={this.props.height}
        viewBox="0 0 1100 593"
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
              fill={this.stateFillColor('DC1')}
              stroke={this.stateStrokeColor('DC1')}
              d="M801.8,253.8 l-1.1-1.6 -1-0.8 1.1-1.6 2.2,1.5z"
            />
            <circle
              className="DC2"
              onClick={() => { this.stateClickHandler('DC'); }}
              data-name={'DC'}
              fill={this.stateFillColor('DC')}
              stroke={this.stateStrokeColor('DC')}
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
