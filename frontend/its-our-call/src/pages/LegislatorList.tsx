import * as React from 'react';

// tslint:disable:no-console

import Http from '../http/Http';

import './Page.css';
import './LegislatorList.css';

import { ResourceListSection,  /*Footer*/ } from '../components';
import { LegislatorRow } from '../components';
import { LegislatorRowDataProps, mapDataToLegislatorRowDataProps } from '../components/LegislatorRow';
import { placeholderHouseReps, placeholderSenatorReps } from '../data/Legislator';

type HeaderStickyOffset = {top?: number, bottom?: number};

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
  headerStickyOffsets: HeaderStickyOffset[];
}

class LegislatorList extends React.Component<LegislatorListProps, LegislatorListState> {
  http = new Http();
  pageRef: Element;
  appHeaderRef: Element | null;
  sectionHeaderHeight: number | null;
  currentResourceListSectionRefs: ResourceListSection[];
  constructor(props: LegislatorListProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    let bookmarkedRep = placeholderHouseReps[50];
    let recentlyViewedReps = [placeholderHouseReps[57], placeholderHouseReps[53]] ;
    this.getAppHeaderHeight = this.getAppHeaderHeight.bind(this);
    this.currentResourceListSectionRefs = [];
    this.state = {
      loadedBookmarkedLegislators: true,
      bookmarkedLegislatorData: [mapDataToLegislatorRowDataProps(bookmarkedRep)], // TODO: real data
      loadedRecentlyViewedLegislators: true,
      recentlyViewedLegislatorData: recentlyViewedReps.map(mapDataToLegislatorRowDataProps), // TODO: real data
      loadedSenateLegislators: true,
      senateLegislatorData: placeholderSenatorReps.map(mapDataToLegislatorRowDataProps), // TODO: real data
      loadedHouseLegislators: true,
      houseLegislatorData: placeholderHouseReps.map(mapDataToLegislatorRowDataProps),
      hasBookmarks: true, // TODO: real data, real logic
      scrollingElem: window,
      windowRef: window,
      headerStickyOffsets: [],
    };
    this.fetchData = this.fetchData.bind(this);
    this.errorFetchingData = this.errorFetchingData.bind(this);
    this.getListSectionRef = this.getListSectionRef.bind(this);
  }

  componentDidMount() {
    this.fetchData();
    this.recalcResourceListSection();
    document.addEventListener('scroll', this.recalcResourceListSection);
    window.addEventListener('resize', this.recalcResourceListSection);
  }
    
  componentWillUnmount() {
    this.currentResourceListSectionRefs = [];
    document.removeEventListener('scroll', this.recalcResourceListSection);
    window.removeEventListener('resize', this.recalcResourceListSection);
  }

  getAppHeaderHeight(): number {
    let appHeaderRef = document.getElementById('AppHeader');
    if (appHeaderRef) {
      return appHeaderRef.getBoundingClientRect().height;
    }
    console.warn('could not find #AppHeader, something major was changed in the dom');
    return 0;
  }

  fetchData() {
    // TODO: fetch each type of legislator & check local bookmarks
    // tslint:disable-next-line:no-any
    this.http.get('/api/legislator').resp.then((legislatorListResp: any) => {
      console.warn(legislatorListResp);
      // this.setState({legislatorData: [legislatorListResp]});
    }).catch(this.errorFetchingData);
    // TODO: if no bookmarks, show recently viewed instead
  }

  // tslint:disable-next-line:no-any
  errorFetchingData(respError: any) {
    // console.warn(respError);
  }

  getListSectionRef(elem: ResourceListSection, i: number) {
    this.currentResourceListSectionRefs[i] = elem;
  }

  buildHeaderOffsetsForListSection(index: number): HeaderStickyOffset {
    if (this.state.headerStickyOffsets.length > index) {
      return this.state.headerStickyOffsets[index];
    }
    return {};
  }

  recalcResourceListSection() {
    if (this.state) {
      let { headerStickyOffsets } = this.state;
      if (this.pageRef) {
        headerStickyOffsets = new Array<HeaderStickyOffset>(this.currentResourceListSectionRefs.length);
        let top: number = this.getAppHeaderHeight();        
        // calc initial bottom offset value
        let bottom: number = this.currentResourceListSectionRefs.reduce(
          (total: number, b: ResourceListSection, index: number) => {
            let headerHeight = b.currentHeaderHeight();
            if (index !== 0 && headerHeight) { total = total + headerHeight; }
            return total;
          }, 0);
        // iterate through each resource
        headerStickyOffsets = this.currentResourceListSectionRefs.map((elem: ResourceListSection, index: number) => {
          let currentOffset: HeaderStickyOffset = { top, bottom };
          // move the vars for the next element in the index
          let heightCurrentHeader = elem.currentHeaderHeight();
          if (heightCurrentHeader) {
            top = top + heightCurrentHeader;
            bottom = bottom - heightCurrentHeader;
          }
          return currentOffset;
        });
      }
      this.setState({ headerStickyOffsets });
    }
}

  render() {
    let hasOptionalSection: boolean = (this.state.hasBookmarks // TODO: actual bookmarks should load
      || (this.state.loadedRecentlyViewedLegislators && this.state.recentlyViewedLegislatorData.length > 0));
    let totalSections = hasOptionalSection ? 3 : 2;
    let senateListSectionIndex = (totalSections - 2);
    let houseListSectionIndex = (totalSections - 1);
    // build the optional resource list section
    let optionalResourceListSection = hasOptionalSection ? (
        <ResourceListSection
          ref={(ref: ResourceListSection) => this.getListSectionRef(ref, 0)}
          rowClass={LegislatorRow}
          headerTitle={this.state.hasBookmarks ? 'BOOKMARKS' : 'RECENTLY VIEWED'}
          dataLoaded={this.state.hasBookmarks
            ? this.state.loadedBookmarkedLegislators : this.state.loadedRecentlyViewedLegislators}
          data={this.state.hasBookmarks
            ? this.state.bookmarkedLegislatorData : this.state.recentlyViewedLegislatorData}
          isCollapsible={true}
          isSticky={true}
          sectionIndex={0}
          sectionHeaderOffsets={this.buildHeaderOffsetsForListSection(0)}
        />
    ) : (null);
    return (
      <div className="Page LegislatorList" ref={(ref: HTMLDivElement) => this.pageRef = ref}>
        <div className="full-height scrollable">
          <div className="list-header">
            {/* the list header is not sticky */}
            Legislator List
          </div>
          {optionalResourceListSection}
          <ResourceListSection
            ref={(ref: ResourceListSection) => this.getListSectionRef(ref, senateListSectionIndex)}
            headerTitle="SENATE"
            rowClass={LegislatorRow}
            dataLoaded={this.state.loadedSenateLegislators}
            data={this.state.senateLegislatorData}
            isCollapsible={true}
            isSticky={true}
            sectionIndex={senateListSectionIndex}
            sectionHeaderOffsets={this.buildHeaderOffsetsForListSection(senateListSectionIndex)}
          />
          <ResourceListSection
            ref={(ref: ResourceListSection) => this.getListSectionRef(ref, (houseListSectionIndex))}
            headerTitle="HOUSE"
            rowClass={LegislatorRow}
            data={this.state.houseLegislatorData}
            dataLoaded={this.state.loadedHouseLegislators}
            isCollapsible={true}
            isSticky={true}
            sectionIndex={houseListSectionIndex}
            sectionHeaderOffsets={this.buildHeaderOffsetsForListSection(houseListSectionIndex)}
          />
          {
            /* TODO: <Footer /> */
          }
        </div>
      </div>
    );
  }
}

export default LegislatorList;
