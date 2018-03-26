import * as React from 'react';

import Http from '../http/Http';

import './Page.css';
import './LegislatorList.css';

import { ResourceListSection, Footer } from '../components';
import { LegislatorRow } from '../components';
import { LegislatorRowDataProps } from '../components/LegislatorRow';

interface LegislatorListProps { }

interface LegislatorListState {
  loadedBookmarkedLegislators: boolean;
  bookmarkedLegislatorData: LegislatorRowDataProps[];
  loadedSenateLegislators: boolean;
  senateLegislatorData: LegislatorRowDataProps[];
  loadedHouseLegislators: boolean;
  houseLegislatorData: LegislatorRowDataProps[];
}

class LegislatorList extends React.Component<LegislatorListProps, LegislatorListState> {
  http = new Http();
  constructor(props: LegislatorListProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    this.state = {
      loadedBookmarkedLegislators: true,
      bookmarkedLegislatorData: [{ isBookmarkRow: true }], // TODO: real data
      loadedSenateLegislators: true,
      senateLegislatorData: [{ isBookmarkRow: false }, { isBookmarkRow: false }], // TODO: real data
      loadedHouseLegislators: true,
      houseLegislatorData: [{ isBookmarkRow: false }, { isBookmarkRow: false }, { isBookmarkRow: false }],
      // TODO: real data
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
  }
  // tslint:disable-next-line:no-any
  errorFetchingData(respError: any) {
    // console.warn(respError);
  }

  render() {
    // TODO: if no bookmarks, show recently viewed
    return (
      <div className="Page LegislatorList">
        <div className="full-height scrollable">
          <ResourceListSection
            headerTitle="BOOKMARKS"
            rowClass={LegislatorRow}
            loaded={this.state.loadedBookmarkedLegislators}
            data={this.state.bookmarkedLegislatorData}
          />
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
