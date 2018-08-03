import * as React from 'react';
import * as d3 from 'd3';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson';
import usTopoJsonData from '../data/topojson-us';
import { GeometryObject } from '../../node_modules/@types/topojson-specification';

import './MapD3.css';

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
  doneBuildingPaths: boolean;
  paths: JSX.Element[];
  currentQueue: number;
}

let lastMapId = 0;
let newMapID = function() {
  lastMapId++;
  return `map${lastMapId}`;
};

// tslint:disable-next-line:no-any
let countryClicked = function(params: any) {
  console.log(params);
};

export default class MapD3 extends React.Component<MapSVGProps, MapD3State> {
  uniqueID: string | undefined;
  constructor(props: MapSVGProps) {
    super(props);
    this.zoneFillColor = this.zoneFillColor.bind(this);
    this.zoneStrokeColor = this.zoneStrokeColor.bind(this);
    this.stateClickHandler = this.stateClickHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.createMap = this.createMap.bind(this);
    this.state = {
      defaultFill: props.defaultFill ? props.defaultFill : 'rgba(0,0,0,0)',
      defaultStroke: props.defaultStroke ? props.defaultStroke : 'rgba(0,0,0,0)',
      outerStroke: '#C9C9C9',
      doneBuildingPaths: false,
      paths: [],
      currentQueue: 0,
    };
  }

  componentDidMount() {
    let currentQueue = this.state.currentQueue + 1;
    this.setState({
      paths: [],
      currentQueue,
      doneBuildingPaths: false
    });
    this.createMap();
  }

  componentWillReceiveProps(props: MapSVGProps) {
    let currentQueue = this.state.currentQueue + 1;
    this.setState({
      paths: [],
      currentQueue,
      doneBuildingPaths: false,
    });
  }

  createMap() {
    var width = 938;
    var height = 500;

    var projection = d3Geo.geoAlbersUsa()
      .scale(900) // 500
      .translate([width / 2, height / 1.75]);
    var path = d3Geo.geoPath().projection(projection);
    var svg;
    if (this.uniqueID) {
      svg = d3.select('#' + this.uniqueID).append('svg');
    } else {
      svg = d3.select('body').append('svg');
    }

    svg.attr('preserveAspectRatio', 'xMidYMid')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('width', width)
    .attr('height', height);
    // .attr("width", m_width)
    // .attr("height", m_width * height / width);

    // TODO: load the json externally like this:
    //  d3.json("/d/4090846/us.json", function(error, us) {
    var us = usTopoJsonData;
    svg.insert('path', '.graticule')
      .datum(topojson.feature(us, us.objects.land))
      .attr('class', 'land')
      .attr('d', path);

    // let mesh = topojson.mesh(us, us.objects.counties, 
    //     function(a: GeometryObject, b: GeometryObject) { 
    //       // tslint:disable-next-line
    //       return a !== b && !((a.id as number) / 1000 ^ (b.id as number) / 1000); 
    //     });
    // svg.insert('path', '.graticule')
    //   .datum(mesh)
    //   .attr('class', 'county-boundary')
    //   .attr('d', path);
    console.log('us.objects.states');
    console.log(us.objects.states);

    svg.insert('path', '.graticule')
      .datum(topojson.mesh(us, us.objects.states, 
        function(a: GeometryObject, b: GeometryObject) { 
          return a !== b;
        }
      ))
      .attr('class', 'state-boundary')
      .attr('d', path).on('click', countryClicked);
      // });
      // make interactive paths
      // svg.insert('path', '.graticule')
    //   .data(us.objects.states).enter().append('d') topojson.mesh(us, us.objects.states, 
    //     function(a: GeometryObject, b: GeometryObject) { 
    //       return a !== b;
    //     }
    //   ))
    //   .attr('class', 'state-boundary')
    //   .attr('d', path).on('click', countryClicked);
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
      <div className="MapD3" id={this.uniqueID} />
    );
  }
}
