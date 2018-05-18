import * as React from 'react';

import Http from '../http/Http';

import './Page.css';
import './LegislatorList.css';

import { ResourceListSection,  /*Footer*/ } from '../components';
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
  scrollingElem: Element | Window;
  windowRef: Window;
  headerElements: Element[];
  headerOffsets: {top: number; bottom: number; }[];
  listSectionsContent: Element[];
}

class LegislatorList extends React.Component<LegislatorListProps, LegislatorListState> {
  http = new Http();
  pageRef: Element;
  scrollPosRef: Element;
  appHeaderRef: Element | null;
  constructor(props: LegislatorListProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    let bookmarkedRep = placeholderHouseReps[50];
    let recentlyViewedReps = [placeholderHouseReps[57], placeholderHouseReps[53]] ;
    this.appHeaderRef = document.getElementById('AppHeader');
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
      scrollingElem: window,
      windowRef: window,
      headerOffsets: [],
      headerElements: [],
      listSectionsContent: [],
    };
    this.fetchData = this.fetchData.bind(this);
    this.errorFetchingData = this.errorFetchingData.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    this.calcTotalTopHeight = this.calcTotalTopHeight.bind(this);
    this.calcTotalBottomHeight = this.calcTotalBottomHeight.bind(this);
    this.updateHeaderPositions = this.updateHeaderPositions.bind(this);
  }

  componentDidMount() {
    this.fetchData();
    let listSections = Array.from(this.pageRef.getElementsByClassName('ResourceListSection'));
    let headerElements: Element[] = [];
    let listSectionsContent: Element[] = [];
    listSections.forEach((e: Element) => {
      headerElements.push(e.getElementsByClassName('ListSectionHeaderRow')[0]);
      listSectionsContent.push(e.getElementsByClassName('section-content')[0]);
    });
    this.setState({headerElements, listSectionsContent});
    this.state.scrollingElem.addEventListener('scroll', this.onScroll, false);
    this.state.windowRef.addEventListener('onresize', this.onResize, false);
  }

  componentWillUnmount() {
    this.state.scrollingElem.removeEventListener('scroll', this.onScroll, false);
    this.state.windowRef.removeEventListener('onresize', this.onResize, false);
  }

  onScroll() {
    this.updateHeaderPositions();
  }
  onResize() {
    this.updateHeaderPositions();
  }

  calcTotalBottomHeight() {
    var totalBottomHeight = 0;
    this.state.headerElements.forEach((header: Element) => {
      header.classList.contains('sticky-bottom');
      totalBottomHeight = totalBottomHeight + header.getBoundingClientRect().height;
    });
    return totalBottomHeight;
  }
  calcTotalTopHeight() {
    var totalTopHeight = 0;
    this.state.headerElements.forEach((header: Element) => {
      header.classList.contains('sticky-header');
      totalTopHeight = totalTopHeight + header.getBoundingClientRect().height;
    });
    return totalTopHeight;
  }

  updateHeaderPositions() {
    // tslint:disable:no-console
    let scrollBounds = this.scrollPosRef.getBoundingClientRect();
    console.log(scrollBounds);
    var totalTopHeight = 0;
    var i;
    for (i = 0; i < this.state.headerElements.length; i++) {
      var header = this.state.headerElements[i];
      if (header && header.parentNode) {
        var headerRectTop = header.getBoundingClientRect().top;
        var headerRectBottom = header.getBoundingClientRect().bottom;
        var headerHeight = header.getBoundingClientRect().height;
        totalTopHeight = totalTopHeight + header.scrollHeight;
        console.log(`header ${i} ${headerRectTop} ${headerRectBottom} ${headerHeight}`);
      }
    }
  }

  fetchData() {
    // TODO: fetch each type of legislator & check local bookmarks
    // tslint:disable-next-line:no-any
    // this.http.get('/api/legislator').resp.then((legislatorListResp: any) => {
    //   // console.warn(legislatorListResp);
    //   // this.setState({legislatorData: [legislatorListResp]});
    // }).catch(this.errorFetchingData);
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
        collapsible={true}
      />
    );
    if (topResourceListSectionData.length === 0) {
      topResourceListSection = (null);
    }

    return (
      <div className="Page LegislatorList" ref={(ref: HTMLDivElement) => this.pageRef = ref}>
        <div className="full-height scrollable" ref={(ref: HTMLDivElement) => this.scrollPosRef = ref}>
          <div className="list-header">
            Legislator List
          </div>
          {topResourceListSection}
          <ResourceListSection
            headerTitle="SENATE"
            rowClass={LegislatorRow}
            loaded={this.state.loadedSenateLegislators}
            data={this.state.senateLegislatorData}
            collapsible={true}
          />
          <ResourceListSection
            headerTitle="HOUSE"
            rowClass={LegislatorRow}
            loaded={this.state.loadedHouseLegislators}
            data={this.state.houseLegislatorData}
            collapsible={true}
          />
          {/* <Footer /> */}
        </div>
      </div>
    );
  }
}

export default LegislatorList;
