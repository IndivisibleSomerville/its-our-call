import * as React from 'react';

interface MapAreaSVGProps {
  dimensions: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  state: string;
  onClickState: (state: string) => void;
}

interface MapAreaSVGState {
}

export default class MapAreaSVG extends React.Component<MapAreaSVGProps, MapAreaSVGState> {
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
}
