import * as React from 'react';
import * as d3 from 'd3/';

interface MapSVGProps {
  width: number;
  height: number;
}

export default class MapSVG extends React.Component<MapSVGProps, {}> {
  ref: SVGSVGElement;

  componentDidMount() {
    d3.select((this.ref as Element))
    .append('circle')
    .attr('r', 5)
    .attr('cx', this.props.width / 2)
    .attr('cy', this.props.height / 2)
    .attr('fill', 'red');
  }

  render() {
    return (
      <svg
        className="container"
        ref={(ref: SVGSVGElement) => this.ref = ref}
        width={this.props.width}
        height={this.props.height}
      >
        &nbsp;
      </svg>
    );
  }
}
