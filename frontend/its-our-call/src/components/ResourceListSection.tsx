import * as React from 'react';

import ListSectionHeaderRow from './ListSectionHeaderRow';
import { ResourceRowProps } from './ResourceRow';

import './ResourceListSection.css';

type RowComponentType = React.ComponentType<ResourceRowProps>;

interface ResourceListSectionProps {
  collapsible?: boolean;
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
  headerLinkLabel: string;
  collapsed: boolean;
  totalRowsHeight: number;
}

class ResourceListSection extends React.Component<ResourceListSectionProps, ResourceListSectionState> {
  rowsRef: Element;
  constructor(props: ResourceListSectionProps) {
     super(props);
     this.collapsedClicked = this.collapsedClicked.bind(this);
     this.state = {
       headerLinkLabel: this.props.headerLinkLabel ? this.props.headerLinkLabel : 'see all',
       collapsed: false,
       totalRowsHeight: 100,
     };
  }
  componentWillReceiveProps(props: ResourceListSectionProps) {
    if (this.props.collapsible !== props.collapsible) {
      this.setState({collapsed: false});
    }
  }
  componentDidMount() {
    if (this.props.collapsible) {
      let rows = Array.from(this.rowsRef.children);
      this.setState({totalRowsHeight: rows.reduce((height: number, r: Element) => {
        return height + r.scrollHeight;
      }, 0)});
    }
    if (this.props.sticky) {
      // this.props.headerTopStickyOffset;
      // this.props.headerBottomStickyOffset;

      // header positions
    }
  }

  collapsedClicked() {
    if (this.props.collapsible) {
      this.setState({collapsed: !this.state.collapsed});
    }
  }

  render() {
    // let currentHeight = this.state.totalRowsHeight;
    // maxHeight: this.state.collapsed ? 0 : currentHeight
    let sectionHeightStyle: React.CSSProperties = {};
    // IDEA shortcut the height to silently skip the numerous rows hidden by the scroll
    // (will need to compensate for sticky scrolling as well)
    // if (this.state.collapsed) {
    //   sectionHeightStyle.height = Math.min(this.state.totalRowsHeight, window.innerHeight);
    // }
    //
    let sectionBody = (<div className="loading">Loading...</div>);
    if (this.props.loaded) {
      sectionBody = (<div className="no-data">Nothing found.</div>);
      if (this.props.data.length > 0) {
        // tslint:disable-next-line:no-any
        let rows = this.props.data.map((datum: any, index: number) => {
          return (<this.props.rowClass key={index} data={datum} />);
        });
        sectionBody = (
          <div className="rows" ref={(ref: HTMLDivElement) => this.rowsRef = ref}>
            {rows}
          </div>
        );
      }
    }
    //
    return (
      <div
        className={
        'ResourceListSection'
        + (this.props.collapsible ? ' collapsible' : '')
        + (this.state.collapsed ? ' collapsed' : ' expanded')
        }
      >
        <ListSectionHeaderRow
          title={this.props.headerTitle}
          linkLabel={this.state.headerLinkLabel}
          linkTo={this.props.headerLink}
          collapsible={this.props.collapsible}
          collapsed={this.state.collapsed}
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
      </div>
    );
  }
}

export default ResourceListSection;
