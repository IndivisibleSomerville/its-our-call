import * as React from 'react';
import * as d3 from 'd3';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson';
import { FIPStoPO } from '../data/mappings';
// import { GeometryObject } from '../../node_modules/@types/topojson-specification';

import './MapD3.css';

// tslint:disable-next-line:max-line-length
const topoJsonSource = 'https://raw.githubusercontent.com/andrewtremblay/andrewtremblay.github.com/master/json/_temp/topoJSON';
const congressionalDistrictsTopoJsonURL = `${topoJsonSource}/cb_2017_us_cd115_20m.json`;
const statesTopoJsonURL = `${topoJsonSource}/cb_2017_us_state_20m.json`;

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
  currentQueue: number;
}

let lastMapId = 0;
let newMapID = function() {
  lastMapId++;
  return `map${lastMapId}`;
};

// // tslint:disable-next-line:no-any
// let countryClicked = function(params: any) {
//   console.log(params);
// };

export default class MapD3 extends React.Component<MapSVGProps, MapD3State> {
  uniqueID: string | undefined;
  // tslint:disable-next-line:no-any
  svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  constructor(props: MapSVGProps) {
    super(props);
    this.zoneFillColor = this.zoneFillColor.bind(this);
    this.zoneStrokeColor = this.zoneStrokeColor.bind(this);
    this.stateClickHandler = this.stateClickHandler.bind(this);
    this.createMap = this.createMap.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.topoJsonUrlFromProps = this.topoJsonUrlFromProps.bind(this);
    this.selectObjectsDataFromProps = this.selectObjectsDataFromProps.bind(this); 
    this.state = {
      defaultFill: props.defaultFill ? props.defaultFill : 'rgba(0,0,0,0)',
      defaultStroke: props.defaultStroke ? props.defaultStroke : 'rgba(0,0,0,0)',
      outerStroke: '#C9C9C9',
      doneBuildingPaths: false,
      currentQueue: 0,
    };
  }

  componentDidMount() {
    let currentQueue = this.state.currentQueue + 1;
    this.setState({
      currentQueue,
      doneBuildingPaths: false
    });
    this.createMap(this.props);
  }

  componentWillReceiveProps(props: MapSVGProps) {
    let currentQueue = this.state.currentQueue + 1;
    this.setState({
      currentQueue,
      doneBuildingPaths: false,
    });
    console.log('props.customize');
    console.log(props.customize);
    console.log(FIPStoPO);
    this.createMap(props);
  }

  topoJsonUrlFromProps(props: MapSVGProps) {
    if (props.mapType === 'district') {
      return congressionalDistrictsTopoJsonURL;
    } else if (props.mapType === 'state') { 
      return statesTopoJsonURL;
    } else {
      console.error(`Bad prop mapType ${props.mapType}`);
    }
    return '';
  }

  // tslint:disable-next-line:no-any
  selectObjectsDataFromProps(props: MapSVGProps, dataJson: any) {
    if (props.mapType === 'district') {
      return dataJson.objects.cb_2017_us_cd115_20m;
    } else if (props.mapType === 'state') { 
      return dataJson.objects.cb_2017_us_state_20m;
    } else {
      console.error(`Bad prop mapType ${props.mapType}`);
    }
    return {};
  }

  createMap(props: MapSVGProps) {
    var width = 938;
    var height = 500;
    if (!this.uniqueID) {
      throw Error('uniqueID was not defined');
    } else if (this.svg === null || this.svg === undefined) {
      this.svg = d3.select('#' + this.uniqueID).append('svg');
    }
    // We are mapping vote stances as the only use case right now.
    var projection = d3Geo.geoAlbersUsa()
      .scale(900)
      .translate([width / 2, height / 1.75]);
    var path = d3Geo.geoPath().projection(projection);
    
    let thisComponent = this; // reference for inside the 
      
    // TODO: load the topoJson externally through a query 
    console.log(this.topoJsonUrlFromProps(props));
    fetch(this.topoJsonUrlFromProps(props))
     // tslint:disable-next-line:no-any
    .then((result: any) => {
      return result.json();
    // tslint:disable-next-line:no-any
    }).then((dataJson: any) => {
      thisComponent.svg.attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom()
        .on('zoom', function() {
          thisComponent.svg.attr('transform', d3.event.transform);
        }));
      thisComponent.svg.select('g').remove(); // in case there was a previous   
      thisComponent.svg.append('g')
      .attr('class', 'zone')
      .selectAll('path')
      .data((topojson.feature(dataJson, // tslint:disable-next-line:no-any
        thisComponent.selectObjectsDataFromProps(props, dataJson)) as any).features)
      .enter().append('path')  // tslint:disable-next-line:no-any
        .attr('fill', function(feature: any) {
          return thisComponent.zoneFillColor(feature);
          // tslint:disable-next-line:no-any
        }).on('click', (feature: any) => { 
          console.log(`clicked ${feature.properties.STUSPS} on ${Date()}`);
          console.log(thisComponent.props.customize[feature.properties.STUSPS]);
        })
      .attr('d', path);
    });
  }

  // tslint:disable-next-line:no-any
  zoneFillColor(feature: any): string {
    console.warn(feature);
    
    let zoneKey = '';
    if (this.props.mapType === 'state') {
      zoneKey = feature.properties.STUSPS;
    } else {
      let state = FIPStoPO[feature.properties.STATEFP];
      let districtNumber = parseInt(feature.properties.CD115FP, 10) + 1;
      zoneKey = `${state}_${districtNumber}`;
      console.log(`${zoneKey}?`);
    }
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

  stateClickHandler(zone: string) {
    if (this.props.customize && this.props.customize[zone] && this.props.customize[zone].clickHandler) {
      return this.props.customize[zone].clickHandler;
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
