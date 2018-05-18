import * as React from 'react';
import { Link } from 'react-router-dom';
import PlusMinusButton from './PlusMinusButton';

import './ListSectionHeaderRow.css';
// The basic List Section Header is a simple component.
// it contains a title and a link; both optional

interface ListSectionHeaderRowProps {
  title?: string;
  linkTo?: string;
  linkLabel?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  collapsedClicked?: (oldCollapsedVal: boolean) => void;
  isSticky?: boolean;
  scrollPos?: number;
  scrollHeight?: number;
  scrollTopPadding?: number;
  scrollBottomPadding?: number;
}

interface ListSectionHeaderRowState {
  linkTo: string;
  isHidingLink: boolean;
  expanded: boolean;
  stuckToTop?: boolean;
  stuckToBottom?: boolean;
}

class ListSectionHeaderRow extends React.Component<ListSectionHeaderRowProps, ListSectionHeaderRowState> {
  selfRef: Element;
  constructor(props: ListSectionHeaderRowProps) {
    super(props);
    this.collapsedClicked = this.collapsedClicked.bind(this);
    this.state = {
      linkTo: props.linkTo ? props.linkTo : '#',
      isHidingLink: props.linkTo === undefined,
      expanded: props.collapsed === undefined ? true : !props.collapsed,
    };
  }

  componentWillReceiveProps(props: ListSectionHeaderRowProps) {
    if (props.isSticky) {
      if (this.props.scrollPos !== props.scrollPos ||
          this.props.scrollHeight !== props.scrollHeight) {
        let scrollTopPadding = this.props.scrollTopPadding ? this.props.scrollTopPadding : 0;
        let scrollBottomPadding = this.props.scrollBottomPadding ? this.props.scrollBottomPadding : 0;
        let rect = this.selfRef.getBoundingClientRect();
        let stuckToTop = false;
        let stuckToBottom = false;
        if (rect.top <= scrollTopPadding) {
          stuckToTop = true;
        } else if (rect.bottom >= scrollBottomPadding) {
          stuckToBottom = true;
        }
        this.setState({stuckToTop, stuckToBottom});
      }
    }
    this.setState({
      linkTo: props.linkTo ? props.linkTo : '#',
      isHidingLink: props.linkTo === undefined,
      expanded: props.collapsed === undefined ? true : !props.collapsed,
    });
  }

  collapsedClicked() {
    if (this.props.collapsedClicked) {
      this.props.collapsedClicked(!this.state.expanded);
    }
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    if (this.props.title === undefined && this.props.linkLabel === undefined) {
      return null;
    }

    let expandButton = (null);
    if (this.props.collapsible) {
      expandButton = (
        <PlusMinusButton
          showMinus={this.state.expanded}
          onClick={() => { this.collapsedClicked(); }}
        />
      );
    }

    let optionalLinkClasses = 'link' + (this.state.isHidingLink ? ' hidden' : '');
    return (
      <div
        ref={(ref: HTMLDivElement) => {this.selfRef = ref; }}
        className={
          'ListSectionHeaderRow'
          + (this.props.collapsible ? ' collapsible' : '')
          + (this.state.stuckToTop ? ' sticky-header' : '')
          + (this.state.stuckToBottom ? ' sticky-bottom' : '')
        }
      >
        {expandButton}
        <div className="title">{this.props.title}</div>
        <Link className={optionalLinkClasses} to={this.state.linkTo}>{this.props.linkLabel}</Link>
      </div>
    );
  }
}

export default ListSectionHeaderRow;
