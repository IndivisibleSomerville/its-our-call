import * as React from 'react';
import * as d3 from 'd3/';

import './BowGraphSVG.css';

export interface BowGraphSVGProps {
  numOrange: number;
  numWhite: number;
  numGreen: number;
  goalpost: number; // disabled if negative or greater than total
  goalpostOuterWidth?: number; // 20 if not defined (uses svg viewport units)
}

interface BowGraphSVGState {
  numTotal: number;
  goalpostOuterWidth: number;
}

class BowGraphSVG extends React.Component<BowGraphSVGProps, BowGraphSVGState> {
  ref: SVGSVGElement;

  constructor(props: BowGraphSVGProps) {
    super(props);
    this.state = {
      numTotal: (props.numOrange + props.numWhite + props.numGreen),
      goalpostOuterWidth: props.goalpostOuterWidth ? props.goalpostOuterWidth : 20,
    };
  }

  componentDidMount() {
    // build the svg after we get the main html element mounted
    let outerRadius = 100;
    let thinBar = 4;
    let thickBar = 15;
    let height = 150;
    let footLength = 12;

    let orangeWhiteEdge = - 90 + 180 * this.props.numOrange / this.state.numTotal;
    let whiteGreenEdge = orangeWhiteEdge + 180 * this.props.numWhite / this.state.numTotal;
    // convert from degs to radians
    var letOrangeArc = d3.arc()
      .innerRadius(outerRadius - thinBar)
      .outerRadius(outerRadius)
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(orangeWhiteEdge * (Math.PI / 180));
    var letWhiteArc = d3.arc()
      .innerRadius(outerRadius - thickBar)
      .outerRadius(outerRadius)
      .startAngle(orangeWhiteEdge * (Math.PI / 180))
      .endAngle(whiteGreenEdge * (Math.PI / 180));
    var letGreenArc = d3.arc()
      .innerRadius(outerRadius - thinBar)
      .outerRadius(outerRadius)
      .startAngle(whiteGreenEdge * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180));

    d3.select((this.ref as Element)).append('path')
      .attr('d', letOrangeArc)
      .attr('transform', 'translate(100,150)')
      .attr('fill', '#F7C8A7');
    d3.select((this.ref as Element)).append('path')
      .attr('d', letGreenArc)
      .attr('transform', 'translate(100,150)')
      .attr('fill', '#3F8014');
    d3.select((this.ref as Element)).append('path')
      .attr('d', letWhiteArc)
      .attr('fill', '#fff').attr('stroke', '#ccc').attr('stroke-width', .5)
      .attr('transform', 'translate(100,150)');
    // feet are always rendered
    d3.select((this.ref as Element)).append('line')
      .attr('x1', 0).attr('y1', height)
      .attr('x2', footLength).attr('y2', height)
      .attr('stroke', '#ccc').attr('stroke-width', 2);
    d3.select((this.ref as Element)).append('line')
      .attr('x1', outerRadius * 2).attr('y1', height)
      .attr('x2', outerRadius * 2 - footLength).attr('y2', height)
      .attr('stroke', '#ccc').attr('stroke-width', 2.5);
    if (this.props.goalpost > 0 && this.props.goalpost < this.state.numTotal) {
      let arcPercent = this.props.goalpost / this.state.numTotal;
      let xRatio = Math.sin(Math.PI * (arcPercent - .5));
      let yRatio = Math.cos(Math.PI * (-arcPercent - .5));
      let outerBound = outerRadius + this.state.goalpostOuterWidth;
      let innerBound = outerRadius - 20;
      d3.select((this.ref as Element)).append('line')
        .attr('x1', 100 + xRatio * innerBound).attr('y1', yRatio * innerBound)
        .attr('x2', 100 + xRatio * outerBound).attr('y2', yRatio * outerBound)
        .attr('stroke', '#A1A1A1').attr('stroke-width', 1)
        .attr('transform', 'translate(0,150)');
      d3.select((this.ref as Element)).append('text')
        .attr('x', 100 + xRatio * innerBound).attr('y', yRatio * innerBound + 12)
        .attr('text-anchor', 'middle').attr('font-size', '.6rem').attr('font-weight', 400)
        .text(this.props.goalpost)
        .attr('transform', 'translate(0,150)');
    }
  }

  render() {
    return (
      <svg
        className="BowGraphSVG"
        ref={(ref: SVGSVGElement) => this.ref = ref}
        width={'100%'}
        height={'100%'}
        viewBox="0 0 200 150"
      >
        &nbsp;
      </svg>
    );
  }
}

export default BowGraphSVG;
