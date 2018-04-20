import * as React from 'react';

interface USAStateSVGProps {
  dimensions: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  state: string;
  onClickState: (state: string) => void;
}

interface USAStateSVGState {
}

export default class USAStateSVG extends React.Component<USAStateSVGProps, USAStateSVGState> {
  constructor(props: USAStateSVGProps) {
    super(props);
    this.onClickState = this.onClickState.bind(this);
  }

  onClickState() {
    if (this.props.onClickState) {
      this.props.onClickState(this.props.state);
    }
  }

  render() {
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
