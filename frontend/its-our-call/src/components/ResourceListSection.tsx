import * as React from 'react';

import ListSectionHeaderRow from './ListSectionHeaderRow';
import { ResourceRowProps } from './ResourceRow';

import './ResourceListSection.css';

type RowComponentType = React.ComponentType<ResourceRowProps>;

interface ResourceListSectionProps {
  isCollapsible?: boolean;
  sticky?: boolean;
  // defaults to ResourceRow if not overridden
  rowClass: RowComponentType;
  loaded: boolean;
  // tslint:disable-next-line:no-any
  data: any[];
  // pass through the header properties
  headerTitle?: string;
  headerLink?: string;
  headerLinkLabel?: string;
  headerTopStickyOffset?: number;
  headerBottomStickyOffset?: number;
}

interface ResourceListSectionState {
  cachedRows: JSX.Element;
  headerLinkLabel: string;
  isCollapsed: boolean;
  currentHeight: number;
  maxContentScrollHeight: number;
}

class ResourceListSection extends React.Component<ResourceListSectionProps, ResourceListSectionState> {
  cacheRef: Element;
  collapseAnimationStartedAt: Date | undefined;
  constructor(props: ResourceListSectionProps) {
     super(props);
     this.collapsedClicked = this.collapsedClicked.bind(this);
     this.state = {
       cachedRows: this.buildCachedRows(props),
       headerLinkLabel: this.props.headerLinkLabel ? this.props.headerLinkLabel : 'see all',
       isCollapsed: false,
       currentHeight: 0,
       maxContentScrollHeight: 0,
     };
  }
  buildCachedRows(props: ResourceListSectionProps): JSX.Element {
    let toRet: JSX.Element = (<div className="no-data">Nothing found.</div>);
    if (props.data.length > 0) {
      // tslint:disable-next-line:no-any
      let rows = props.data.map((datum: any, index: number) => {
        return (<this.props.rowClass key={index} data={datum} />);
      });
      toRet = (
        <div className="rows">
          {rows}
        </div>
      );
    }
    return toRet;
  }
  componentWillReceiveProps(props: ResourceListSectionProps) {
    let {isCollapsed, cachedRows} = this.state;
    if (this.props.isCollapsible !== props.isCollapsible) {
      isCollapsed = false;
    }
    if (true) {
      // TODO: update cached rows only when necessary
      cachedRows = this.buildCachedRows(props);
    }
    this.setState({isCollapsed, cachedRows});
  }
  componentDidMount() {
    let { maxContentScrollHeight, currentHeight } = this.state;
    if (this.props.sticky) {
      // this.props.headerTopStickyOffset;
      // this.props.headerBottomStickyOffset;
      // header positions
    }
    if (this.props.isCollapsible) {
      maxContentScrollHeight = this.cacheRef.scrollHeight;
      if (this.state.isCollapsed) {
        currentHeight = 0;
      } else {
        currentHeight = maxContentScrollHeight;
      }
    }
    this.setState({maxContentScrollHeight, currentHeight});
  }

  componentDidUpdate(prevProps: ResourceListSectionProps, prevState: ResourceListSectionState) {
    if (this.state.isCollapsed !== prevState.isCollapsed && this.state.maxContentScrollHeight > 0) {
      // TODO: cleanup current direction if needed, trim height
      // IDEA shortcut the height can silently skip the numerous rows hidden by the scroll
      // (will need to compensate for sticky scrolling as well)
      // if (this.state.isCollapsed) {
      //   sectionHeightStyle.height = Math.min(this.state.totalRowsHeight, window.innerHeight);
      // }
      //
      let isCollapsed = this.state.isCollapsed;
      if (isCollapsed) {
        // continue isCollapsed (if there's any area left)
      } else {
        // continue expanding (if there's any area left to expand to)
      }
    }
  }

  collapsedClicked() {
    if (this.props.isCollapsible) {
      this.setState({isCollapsed: !this.state.isCollapsed});
    }
  }

  render() {
    let sectionHeightStyle: React.CSSProperties = {};
    if (this.props.isCollapsible) {
      sectionHeightStyle = {height: this.state.currentHeight};
    }
    let sectionBody = (<div className="loading">Loading...</div>);
    if (this.props.loaded) {
      sectionBody = this.state.cachedRows;
    }
    //
    return (
      <div
        className={
        'ResourceListSection'
        + (this.props.isCollapsible ? ' collapsible' : '')
        + (this.state.isCollapsed ? ' collapsed' : ' expanded')
        }
      >
        <div className="debug">{this.state.currentHeight}</div>
        <ListSectionHeaderRow
          title={this.props.headerTitle}
          linkLabel={this.state.headerLinkLabel}
          linkTo={this.props.headerLink}
          collapsible={this.props.isCollapsible}
          collapsed={this.state.isCollapsed}
          collapsedClicked={this.collapsedClicked}
        />
        <div
          className="section-content"
          style={sectionHeightStyle}
        >
          <div className="header-shadow">&nbsp;</div>
          {sectionBody}
          <div className="bottom-shadow">&nbsp;</div>
        </div>
        <div className="hidden-cache section-content" ref={(ref: HTMLDivElement) => this.cacheRef = ref}>
         {/* Render the cached rows a second time, hidden, for height calculation. */}
         {this.state.cachedRows}
        </div>
      </div>
    );
  }
}

export default ResourceListSection;
