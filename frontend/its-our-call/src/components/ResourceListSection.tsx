import * as React from 'react';

import ListSectionHeaderRow from './ListSectionHeaderRow';
import { ResourceRowProps } from './ResourceRow';

import './ResourceListSection.css';
// import { log } from 'util';

const DurationOfCollapseAnimationMillis = 300;

type RowComponentType = React.ComponentType<ResourceRowProps>;
// tslint:disable:no-console

interface ResourceListSectionProps {
  // the collection can expand or collapse from clicking the button in the header
  isCollapsible?: boolean;
  // the header will never leave the screen, multiple headers with gather at the top or bottom
  isSticky?: boolean;
  // sibling components are not aware of each other, assume that all the headers are the same height 
  // that way you only need to keep track of which index
  sectionIndex?: number;
  sectionHeaderOffsets?: {top?: number, bottom?: number};
  // defaults to ResourceRow if not overridden
  rowClass: RowComponentType;
  // tslint:disable-next-line:no-any
  data: any[];
  dataLoaded: boolean;
  // pass through the header properties
  headerTitle?: string;
  headerLink?: string;
  headerLinkLabel?: string;
}

interface ResourceListSectionState {
  headerLinkLabel: string;
  isCollapsed: boolean;
  wasCollapsed: boolean;
  totalRowsHeightPx: number;
  isMounted: boolean;
}

class ResourceListSection extends React.Component<ResourceListSectionProps, ResourceListSectionState> {
  ref: HTMLDivElement | null; // this current component 
  visibleHeight: number; // total height of this component, recalculated on scroll, mount, collapsedClicked
  wrapperDivRef: HTMLDivElement | null; // this wrapper around the rows/content
  sectionContentRef: HTMLDivElement | null; // this for snapping the height on janky transitions
  headerRef: ListSectionHeaderRow | null;
  constructor(props: ResourceListSectionProps) {
     super(props);
     this.collapsedClicked = this.collapsedClicked.bind(this);
     this.buildStyleForSectionContent = this.buildStyleForSectionContent.bind(this);
     this.listSectionScrolled = this.listSectionScrolled.bind(this);
     this.listSectionWindowResize = this.listSectionWindowResize.bind(this);
     this.recalculateVisibleHeight = this.recalculateVisibleHeight.bind(this);
     this.currentHeaderHeight = this.currentHeaderHeight.bind(this); 
     this.visibleHeight = 0;
     this.state = {
       headerLinkLabel: this.props.headerLinkLabel ? this.props.headerLinkLabel : 'see all',
       isCollapsed: false,
       wasCollapsed: false,
       isMounted: false,
       totalRowsHeightPx: -1,
     };
  }
  componentWillReceiveProps(props: ResourceListSectionProps) {
    let {isCollapsed } = this.state;
    if (this.props.isCollapsible !== props.isCollapsible) {
      isCollapsed = false;
    }
    this.recalculateVisibleHeight();
    this.setState({isCollapsed});
  }
  componentDidMount() {
    let { totalRowsHeightPx } = this.state;
    if (this.wrapperDivRef) {
      totalRowsHeightPx = this.wrapperDivRef.offsetHeight;
    }
    this.recalculateVisibleHeight();
    document.addEventListener('scroll', this.listSectionScrolled);
    window.addEventListener('resize', this.listSectionWindowResize);
    this.setState({isMounted: true, totalRowsHeightPx});
  }
  componentWillUnmount() {
    document.removeEventListener('scroll', this.listSectionScrolled);
    window.removeEventListener('resize', this.listSectionWindowResize);
  }
  currentHeaderHeight(): number | undefined {
    if (this.headerRef) {
      return this.headerRef.currentHeightPx;
    }
    return undefined;
  }
  listSectionScrolled() {
    this.recalculateVisibleHeight();
  }
  listSectionWindowResize() {
    this.recalculateVisibleHeight();    
  }
  recalculateVisibleHeight() {
    if (this.ref) {
      let domRect = this.ref.getBoundingClientRect(); // this.ref.getBoundingClientRect();
      let visibleHeight = 0; // window.innerHeight <= domRect.top 
      if (window.innerHeight > domRect.top) {
       if (domRect.top >= 0) {
         // scrolling with top visible
         visibleHeight = Math.min((window.innerHeight - domRect.top), domRect.height);
       } else {
         // top of the content is up past the top of the screen
         visibleHeight = Math.min((domRect.bottom + domRect.top), window.innerHeight);
       }
      }
      this.visibleHeight = visibleHeight;
     }
  }
  collapsedClicked() {
    if (this.props.isCollapsible) {
      let { isCollapsed } = this.state;
      let wasCollapsed = isCollapsed;
      isCollapsed = !isCollapsed; // toggle when we click
      this.setState({isCollapsed, wasCollapsed}, () => { setTimeout(function() { window.scrollBy(0, 1); }, 500); });
    }
  }
  buildStyleForSectionContent() {
    let styleToRet: React.CSSProperties = {};
    let { totalRowsHeightPx, isCollapsed, isMounted } = this.state;
    let overrideHeightValuePx: number | null = null;
    // TODO: use the add/remove of the .notransition class
    // to coerce the animating height into a more smooth UX
    let sectionContentRef = this.sectionContentRef;
    if (sectionContentRef && this.ref) {
      this.recalculateVisibleHeight();
      let sectionContentDOMRef = sectionContentRef.getBoundingClientRect();
      let isTopOutOfBounds = this.ref.getBoundingClientRect().top < 0; // doesn't change (right now) so we can reuse
      let bottomOfSectionCurrent = sectionContentDOMRef.top + sectionContentDOMRef.height;
      let bottomOfSectionWhenExpanded = sectionContentDOMRef.top + this.state.totalRowsHeightPx;
      if (isCollapsed) {
        // we're collapsing.
        // if the current bounds are off on the top or bottom of the screen then
        if (isTopOutOfBounds || (window.innerHeight < bottomOfSectionCurrent)) {
          console.log(sectionContentRef.classList);
          sectionContentRef.classList.add('notransition');
          console.log(sectionContentRef.classList);
          sectionContentRef.style.height = this.visibleHeight + 'px'; // trim down the target height to visibleHeight
          sectionContentRef.classList.remove('notransition');
          console.log(sectionContentRef.classList);
          // the return value should then collapse it the rest of the way
        }
      }
      if (!isCollapsed) {
        // we're expanding.
        // if the fully expanded dimensions-to-be are out of bounds then:
        if (isTopOutOfBounds || (window.innerHeight < bottomOfSectionWhenExpanded)) {
          overrideHeightValuePx = this.visibleHeight; // trim down the target animation height to ~this.visibleHeight
          setTimeout(() => { 
            // after a small delay:
            if (sectionContentRef) {
              sectionContentRef.classList.add('notransition');
              sectionContentRef.style.height = totalRowsHeightPx + 'px'; // jump to the full height with no more anim
              sectionContentRef.classList.remove('notransition');
            }
          }, DurationOfCollapseAnimationMillis);  
        }
      }
    }
    if (isCollapsed) {
      styleToRet = {'height': '0px'};
    } else if (isMounted && totalRowsHeightPx >= 0) {
      let height: number = overrideHeightValuePx ? overrideHeightValuePx : totalRowsHeightPx;
      styleToRet = {'height': (height + 'px')};
    }
    return styleToRet;
  }
  
  calcOffsetFromProps(direction: 'top' | 'bottom'): number {
   let { sectionHeaderOffsets } = this.props;
   if (sectionHeaderOffsets) {
      if (direction === 'top') {
        return sectionHeaderOffsets.top ? sectionHeaderOffsets.top : 0;
      }
      if (direction === 'bottom') {
        return sectionHeaderOffsets.bottom ? sectionHeaderOffsets.bottom : 0;
      }
    }
   return 0;
  }

  buildClassNamesForResourceListSection() {
    return 'ResourceListSection'
      + (this.props.isCollapsible ? ' collapsible' : '')
      + (this.state.isCollapsed ? ' collapsed' : ' expanded')
      + (this.props.isSticky ? ' sticky' : '');
  }

  render() {
    let content: (JSX.Element | JSX.Element[]) = (<div className="loading">Loading...</div>);
    if (this.props.dataLoaded) {
      content = (<div className="no-data">Nothing found.</div>);
      if (this.props.data.length > 0) {
        // tslint:disable-next-line:no-any
        content = this.props.data.map((datum: any, index: number) => {
          return (<this.props.rowClass key={index} data={datum} />);
        });
      }
    }    
    return (
        <div className={this.buildClassNamesForResourceListSection()} ref={(ref) => { if (ref) { this.ref = ref; }}}>
          <ListSectionHeaderRow
            ref={(ref) => { if (ref) { this.headerRef = ref; }}}
            title={this.props.headerTitle}
            linkLabel={this.state.headerLinkLabel}
            linkTo={this.props.headerLink}
            isSticky={this.props.isSticky}
            targetStickyScrollPositionFromTopPx={this.calcOffsetFromProps('top')}
            targetStickyScrollPositionFromBottomPx={this.calcOffsetFromProps('bottom')}
            collapsible={this.props.isCollapsible}
            collapsed={this.state.isCollapsed}
            collapsedClicked={this.collapsedClicked}
          />
          <div 
            className={'section-content ' + 'sectionIndex' + this.props.sectionIndex}
            style={this.buildStyleForSectionContent()} 
            ref={(ref) => { if (ref) { this.sectionContentRef = ref; }}}
          >
            <div className="header-shadow">&nbsp;</div>
            <div className="content-wrapper" ref={(ref) => { if (ref) { this.wrapperDivRef = ref; }}}>
              {content}
            </div>
            <div className="bottom-shadow">&nbsp;</div>
          </div>
        </div>
      );
    }
}

export default ResourceListSection;
