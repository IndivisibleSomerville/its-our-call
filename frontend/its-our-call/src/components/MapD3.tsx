import * as React from 'react';
import stateData from '../data/usa-states-dimensions';
import districtData from '../data/usa-districts-dimensions';
import * as d3 from 'd3';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson';
import usTopoJsonData from '../data/topojson-us';
import { GeometryObject } from '../../node_modules/@types/topojson-specification';

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

interface MapD3State {
  defaultFill: string;
  defaultStroke: string;
  outerStroke: string;
  viewBox: string;
  doneBuildingPaths: boolean;
  paths: JSX.Element[];
  currentQueue: number;
}

// const DIMENSIONS_KEY = 'dimensions';
const VIEWBOX_KEY = 'viewBox';

let lastMapId = 0;
let newMapID = function() {
  lastMapId++;
  return `map${lastMapId}`;
};

// const stateZoneKeys = Object.keys(stateData).filter((key: string) => { return key !== VIEWBOX_KEY; });
// const districtZoneKeys = Object.keys(districtData).filter((key: string) => { return key !== VIEWBOX_KEY; });

export default class MapD3 extends React.Component<MapSVGProps, MapD3State> {
  uniqueID: string | undefined;
  constructor(props: MapSVGProps) {
    super(props);
    this.zoneFillColor = this.zoneFillColor.bind(this);
    this.zoneStrokeColor = this.zoneStrokeColor.bind(this);
    this.stateClickHandler = this.stateClickHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.buildViewBox = this.buildViewBox.bind(this);
    this.createMap = this.createMap.bind(this);
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
    this.createMap();
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

  createMap() {
    // width={500}
    // height={500}
    var width = 500;
    var height = 500;
    var projection = d3Geo.geoAlbersUsa()
    .scale(1000)
    .translate([width / 2, height / 2]);
    var path = d3Geo.geoPath().projection(projection);
    var svg;
    if (this.uniqueID) {
      svg = d3.select('#' + this.uniqueID).append('svg');
    } else {
      svg = d3.select('body').append('svg');
    }
    svg.attr('width', width).attr('height', height);
    // var svg = d3.select('body').append('svg')
    //   .attr('width', width)
    //   .attr('height', height);
    // TODO: load the json externally like this:
    //  d3.json("/d/4090846/us.json", function(error, us) {
    var us = usTopoJsonData;
    svg.insert('path', '.graticule')
      .datum(topojson.feature(us, us.objects.land))
      .attr('class', 'land')
      .attr('d', path);

    let mesh = topojson.mesh(us, us.objects.counties, 
        function(a: GeometryObject, b: GeometryObject) { 
          // tslint:disable-next-line
          return a !== b && !((a.id as number) / 1000 ^ (b.id as number) / 1000); 
        });
    svg.insert('path', '.graticule')
      .datum(mesh)
      .attr('class', 'county-boundary')
      .attr('d', path);
    svg.insert('path', '.graticule')
      .datum(topojson.mesh(us, us.objects.states, 
        function(a: GeometryObject, b: GeometryObject) { 
          return a !== b;
        }
      ))
      .attr('class', 'state-boundary')
      .attr('d', path);
      // });
  }

  buildViewBox(isStateMap: boolean): string {
    // build zoom and pan adjustments here?
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
  componentWillMount() {
    this.uniqueID = newMapID();
  }

  render() {
    return (
      <div id={this.uniqueID} />
    );
  }
}
