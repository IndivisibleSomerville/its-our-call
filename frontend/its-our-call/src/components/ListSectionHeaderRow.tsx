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
}

interface ListSectionHeaderRowState {
  linkTo: string;
  isHidingLink: boolean;
  expanded: boolean;
}

class ListSectionHeaderRow extends React.Component<ListSectionHeaderRowProps, ListSectionHeaderRowState> {
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
      <div className={'ListSectionHeaderRow ' + (this.props.collapsible ? 'collapsible' : '')}>
        {expandButton}
        <div className="title">{this.props.title}</div>
        <Link className={optionalLinkClasses} to={this.state.linkTo}>{this.props.linkLabel}</Link>
      </div>
    );
  }
}

export default ListSectionHeaderRow;
