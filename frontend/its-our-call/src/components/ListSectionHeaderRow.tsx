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
  targetStickyScrollPositionFromTopPx?: number;
  targetStickyScrollPositionFromBottomPx?: number;
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
  currentHeightPx: number; // -1 if not set
  constructor(props: ListSectionHeaderRowProps) {
    super(props);
    this.currentHeightPx = -1;
    this.updateCurrentHeightPxFromRef = this.updateCurrentHeightPxFromRef.bind(this);
    this.collapsedClicked = this.collapsedClicked.bind(this);
    this.state = {
      linkTo: props.linkTo ? props.linkTo : '#',
      isHidingLink: props.linkTo === undefined,
      expanded: props.collapsed === undefined ? true : !props.collapsed,
    };
    this.updateStickyScrollState = this.updateStickyScrollState.bind(this);
    this.buildStyleForStickyPosition = this.buildStyleForStickyPosition.bind(this);
  }

  componentDidMount() {
    document.addEventListener('scroll', this.updateStickyScrollState);
    this.updateCurrentHeightPxFromRef();
  }

  componentWillUnMount() {
    document.removeEventListener('scroll', this.updateStickyScrollState);
  }

  componentWillReceiveProps(props: ListSectionHeaderRowProps) {
    this.setState({
      linkTo: props.linkTo ? props.linkTo : '#',
      isHidingLink: props.linkTo === undefined,
      expanded: props.collapsed === undefined ? true : !props.collapsed,
    });
  }

  componentDidUpdate() {
    this.updateCurrentHeightPxFromRef();
  }

  updateCurrentHeightPxFromRef() {
    if (this.selfRef) {
      this.currentHeightPx = this.selfRef.getBoundingClientRect().height; 
    }
  }

  collapsedClicked() {
    if (this.props.collapsedClicked) {
      this.props.collapsedClicked(!this.state.expanded);
    }
    this.setState({expanded: !this.state.expanded});
  }

  updateStickyScrollState() {
    let { stuckToTop, stuckToBottom } = this.state;
    if (this.selfRef) {
      // tslint:disable:no-console
      let domRect = this.selfRef.getBoundingClientRect(); // this.ref.getBoundingClientRect();
      console.debug('with selfRef: ' + this.props.isSticky + ' ' + 
      domRect.top + ' ' + this.props.targetStickyScrollPositionFromTopPx);
      if (this.props.isSticky && this.props.targetStickyScrollPositionFromTopPx !== undefined) {
        stuckToTop = (this.props.targetStickyScrollPositionFromTopPx >= domRect.top);
      }
      if (this.props.isSticky && this.props.targetStickyScrollPositionFromBottomPx !== undefined) {
        stuckToBottom = ((window.innerHeight - domRect.bottom) <= this.props.targetStickyScrollPositionFromBottomPx);
      }
      console.debug(`stuckToTop ${stuckToTop} stuckToBottom ${stuckToBottom}`);
      this.setState({stuckToTop, stuckToBottom});
    }
  }

  buildStyleForStickyPosition() {
    let styleToRet: React.CSSProperties = {};
    if (this.props.isSticky && (this.state.stuckToTop || this.state.stuckToBottom)) {
      if (this.state.stuckToTop) {
        styleToRet = {
          'position': 'fixed',
          'top': (this.props.targetStickyScrollPositionFromTopPx + 'px')
        };
      } else if (this.state.stuckToBottom) {
        styleToRet = {
          'position': 'fixed',
          'bottom': (this.props.targetStickyScrollPositionFromBottomPx + 'px')
        };
      }
    }
    console.debug('buildStyleForStickyPosition');
    console.debug(styleToRet);
    return styleToRet;
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
          + (this.props.isSticky ? ' sticky' : '')
        }
      >
        <div className={'content'} style={this.buildStyleForStickyPosition()}>
          {expandButton}
          <div className="title">{this.props.title}</div>
          <Link className={optionalLinkClasses} to={this.state.linkTo}>{this.props.linkLabel}</Link>
        </div>
      </div>
    );
  }
}

export default ListSectionHeaderRow;
