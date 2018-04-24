import * as React from 'react';

import Http from '../http/Http';

import './Page.css';
import './LegislatorList.css';

import { ResourceListSection, Footer } from '../components';
import { LegislatorRow } from '../components';
import { LegislatorRowDataProps, mapDataToLegislatorRowDataProps } from '../components/LegislatorRow';
import { placeholderHouseReps, placeholderSenatorReps } from '../data/Legislator';

interface LegislatorListProps { }

interface LegislatorListState {
  loadedBookmarkedLegislators: boolean;
  bookmarkedLegislatorData: LegislatorRowDataProps[];
  loadedRecentlyViewedLegislators: boolean;
  recentlyViewedLegislatorData: LegislatorRowDataProps[];
  loadedSenateLegislators: boolean;
  senateLegislatorData: LegislatorRowDataProps[];
  loadedHouseLegislators: boolean;
  houseLegislatorData: LegislatorRowDataProps[];
  hasBookmarks: boolean;
}

class LegislatorList extends React.Component<LegislatorListProps, LegislatorListState> {
  http = new Http();
  constructor(props: LegislatorListProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    let bookmarkedRep = placeholderHouseReps[50];
    let recentlyViewedReps = [placeholderHouseReps[57], placeholderHouseReps[53]] ;
    this.state = {
      loadedBookmarkedLegislators: true,
      bookmarkedLegislatorData: [mapDataToLegislatorRowDataProps(bookmarkedRep)], // TODO: real data
      loadedRecentlyViewedLegislators: true,
      recentlyViewedLegislatorData: recentlyViewedReps.map(mapDataToLegislatorRowDataProps), // TODO: real data
      loadedSenateLegislators: true,
      senateLegislatorData: placeholderSenatorReps.map(mapDataToLegislatorRowDataProps), // TODO: real data
      loadedHouseLegislators: true,
      houseLegislatorData: placeholderHouseReps.map(mapDataToLegislatorRowDataProps),
      // TODO: real data, real logic
      hasBookmarks: (Math.random() < .5),
    };
    this.fetchData = this.fetchData.bind(this);
    this.errorFetchingData = this.errorFetchingData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    // TODO: fetch each type of legislator & check local bookmarks
    // tslint:disable-next-line:no-any
    this.http.get('/api/legislator').resp.then((legislatorListResp: any) => {
      // console.warn(legislatorListResp);
      // this.setState({legislatorData: [legislatorListResp]});
    }).catch(this.errorFetchingData);
    // TODO: if no bookmarks, show recently viewed instead
  }
  // tslint:disable-next-line:no-any
  errorFetchingData(respError: any) {
    // console.warn(respError);
  }

  render() {
    let topResourceListSectionHeaderTitle = 'RECENTLY VIEWED';
    let topResourceListSectionLoaded = this.state.loadedRecentlyViewedLegislators;
    let topResourceListSectionData = this.state.recentlyViewedLegislatorData;
    if (this.state.hasBookmarks) {
      topResourceListSectionHeaderTitle = 'BOOKMARKS';
      topResourceListSectionLoaded = this.state.loadedBookmarkedLegislators;
      topResourceListSectionData = this.state.bookmarkedLegislatorData;
    }

    let topResourceListSection: JSX.Element | null = (
      <ResourceListSection
        headerTitle={topResourceListSectionHeaderTitle}
        rowClass={LegislatorRow}
        loaded={topResourceListSectionLoaded}
        data={topResourceListSectionData}
      />
    );
    if (topResourceListSectionData.length === 0) {
      topResourceListSection = (null);
    }

    return (
      <div className="Page LegislatorList">
        <div className="full-height scrollable">
          <div className="list-header">
            Legislator List
          </div>
          {topResourceListSection}
          <ResourceListSection
            headerTitle="SENATE"
            rowClass={LegislatorRow}
            loaded={this.state.loadedSenateLegislators}
            data={this.state.senateLegislatorData}
          />
          <ResourceListSection
            headerTitle="HOUSE"
            rowClass={LegislatorRow}
            loaded={this.state.loadedHouseLegislators}
            data={this.state.houseLegislatorData}
          />
          <Footer />
        </div>
      </div>
    );
  }
}

export default LegislatorList;
