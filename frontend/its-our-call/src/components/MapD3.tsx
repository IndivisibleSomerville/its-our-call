import * as React from 'react';
import * as d3 from 'd3';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson';
import { FIPStoPO } from '../data/mappings';

import './MapD3.css';

// available resolutions 20m 5m, please replace this with a backend
// tslint:disable-next-line:max-line-length
const topoJsonSource = 'https://raw.githubusercontent.com/andrewtremblay/andrewtremblay.github.com/master/json/_temp/topoJSON';
const congressionalDistrictsTopoJsonURL = `${topoJsonSource}/cb_2017_us_cd115_5m.json`;
const statesTopoJsonURL = `${topoJsonSource}/cb_2017_us_state_5m.json`;

// tslint:disable:no-console
interface MapD3Props {
  width: number | string;
  height: number | string;
  mapType: 'state' | 'district';
  customize: { [key: string]: { fill?: string, stroke?: string, clickHandler?: (state: string) => void }};
  defaultFill?: string;
  defaultStroke?: string;
  defaultClick?: (zoneId: string) => void;
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

export default class MapD3 extends React.Component<MapD3Props, MapD3State> {
  uniqueID: string | undefined;
  // tslint:disable-next-line:no-any
  svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  constructor(props: MapD3Props) {
    super(props);
    this.topoJsonUrlFromProps = this.topoJsonUrlFromProps.bind(this);
    this.selectFeaturesFromJson = this.selectFeaturesFromJson.bind(this); 
    this.getZoneKeyFromFeature = this.getZoneKeyFromFeature.bind(this);
    this.zoneFillColor = this.zoneFillColor.bind(this);
    this.getClickHandler = this.getClickHandler.bind(this);
    this.createMap = this.createMap.bind(this);
    this.state = {
      defaultFill: props.defaultFill ? props.defaultFill : 'rgba(0,0,0,0)',
      defaultStroke: props.defaultStroke ? props.defaultStroke : 'rgba(0,0,0,0)',
      outerStroke: '#C9C9C9',
      doneBuildingPaths: false,
      currentQueue: 0,
    };
  }

  componentWillMount() {
    this.uniqueID = newMapID();
  }

  componentDidMount() {
    let currentQueue = this.state.currentQueue + 1;
    this.setState({
      currentQueue,
      doneBuildingPaths: false
    });
    this.createMap(this.props);
  }

  componentWillReceiveProps(props: MapD3Props) {
    let currentQueue = this.state.currentQueue + 1;
    this.setState({
      currentQueue,
      doneBuildingPaths: false,
    });
    this.createMap(props);
  }

  topoJsonUrlFromProps(props: MapD3Props) {
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
  selectFeaturesFromJson(props: MapD3Props, dataJson: any) {
    // tslint:disable-next-line:no-any  
    let jsonData: any = {};
    // available resolutions 20m 5m
    // change these with the url
    if (props.mapType === 'district') {
      jsonData = dataJson.objects.cb_2017_us_cd115_5m;
    } else if (props.mapType === 'state') { 
      jsonData = dataJson.objects.cb_2017_us_state_5m;
    } else {
      console.error(`Bad prop mapType ${props.mapType}`);
    }
    // tslint:disable-next-line:no-any  
    return (topojson.feature(dataJson, jsonData) as any).features;
  }

  // tslint:disable-next-line:no-any
  getZoneKeyFromFeature(feature: any): string {
    let zoneKey = '';
    if (this.props.mapType === 'state') {
      zoneKey = feature.properties.STUSPS;
    } else {
      let state = FIPStoPO[feature.properties.STATEFP];
      let districtNumber = parseInt(feature.properties.CD115FP, 10) + 1;
      zoneKey = `${state}_${districtNumber}`;
    }
    return zoneKey;
  }

  // tslint:disable-next-line:no-any
  zoneFillColor(feature: any): string {    
    let zoneKey = this.getZoneKeyFromFeature(feature);
    if (this.props.customize[zoneKey]) {
      let safeFill: string | undefined = this.props.customize[zoneKey].fill;
      if (safeFill) {
        return safeFill;
      }
    }
    return this.state.defaultFill;
  }

  // tslint:disable-next-line:no-any
  getClickHandler(feature: any) {
    let zoneKey = this.getZoneKeyFromFeature(feature);
    if (this.props.customize && this.props.customize[zoneKey] && this.props.customize[zoneKey].clickHandler) {
      return this.props.customize[zoneKey].clickHandler;
    }
    return this.props.defaultClick;
  }

  createMap(props: MapD3Props) {
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
    
    let thisComponent = this; // reference for inside the fetch
    
    fetch(this.topoJsonUrlFromProps(props))
     // tslint:disable-next-line:no-any
    .then((result: any) => {
      return result.json();
    // tslint:disable-next-line:no-any
    }).then((dataJson: any) => {
      thisComponent.svg.attr('preserveAspectRatio', 'xMidYMid')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('width', width)
      .attr('height', height);
      thisComponent.svg.select('g').remove(); // in case there was a previous map
      let zones = thisComponent.svg.append('g')
        .attr('class', 'zone')
        .selectAll('path')
        .data(thisComponent.selectFeaturesFromJson(props, dataJson))
        .enter().append('path')
          // tslint:disable-next-line:no-any
          .attr('fill', function(feature: any) {
            return thisComponent.zoneFillColor(feature);
          // tslint:disable-next-line:no-any
          }).on('click', (feature: any) => { 
            let clickFeature = thisComponent.getClickHandler(feature);
            if (clickFeature) {
              clickFeature(thisComponent.getZoneKeyFromFeature(feature));
            }
          })
        .attr('d', path);
      // add pan & zoom to the map zones
      thisComponent.svg.call(
        d3.zoom()
          .scaleExtent([1, 25])
          .translateExtent([[0, 0], [width, height]])
          .on('zoom', () => { 
            console.log(d3.event.transform);
            zones.attr('transform', d3.event.transform);
            zones.attr('stroke-width', function() {
              return 1 / d3.event.transform.k;
            });
          })
      );
      // add zoom in and out and zoom-reset buttons
      // thisComponent.svg.append('')
    });
  }

  render() {
    return (
      <div className="MapD3" id={this.uniqueID} />
    );
  }
}
