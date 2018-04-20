import * as React from 'react';
import USAStateSVG from './USAStateSVG';
import stateData from '../data/usa-states-dimensions';

// tslint:disable:no-console
interface MapSVGProps {
  width: number;
  height: number;
  customize?: { string: { fill?: string, stroke?: string, clickHandler: (state: string) => void }};
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
    this.state = {
      defaultFill: props.defaultFill ? props.defaultFill : 'rgba(0,0,0,0)',
      defaultStroke: props.defaultStroke ? props.defaultStroke : 'rgba(0,0,0,0)',
      outerStroke: '#F2F2F2',
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
          strokeWidth={strokeWidth ? strokeWidth : 1}
          stroke={outline ? '#FFFFFF' : this.stateStrokeColor(stateKey)}
          fill={outline ? '#FFFFFF' : this.stateFillColor(stateKey)}
          onClickState={outline ? (s: string) => { /* no-op */ } : this.stateClickHandler}
        />
      );
    });
  }

  stateFillColor(state: string): string {
    if (this.props.customize && this.props.customize[state] && this.props.customize[state].fill) {
      return this.props.customize[state].fill;
    }
    return this.state.defaultFill;
  }
  stateStrokeColor(state: string): string {
    if (this.props.customize && this.props.customize[state] && this.props.customize[state].stroke) {
      return this.props.customize[state].stroke;
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
        <rect width="100%" height="100%" fill={'#C9C9C9'} mask="url(#mask2)" />
        <rect width="100%" height="100%" fill={this.state.outerStroke} mask="url(#mask1)" />
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
          <g className="state-label VT">
            <circle
              data-name={'VT'}
              fill={this.stateFillColor('VT')}
              stroke={this.state.outerStroke}
              strokeWidth="5"
              cx="975"
              cy="200"
              r="40"
              opacity="1"
            />
            <text
              textAnchor="middle"
              x="975"
              y="200"
            >
              {'VT'}
            </text>
          </g>
        </g>
      </svg>
    );
  }
}
