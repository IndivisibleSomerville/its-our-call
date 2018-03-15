import * as React from 'react';
import { Link } from 'react-router-dom';

// The basic List Section Header is a simple component.
// it contains a title and a link; both optional

interface ListSectionHeaderRowProps {
  title?: string;
  linkTo?: string;
  linkLabel?: string;
}

interface ListSectionHeaderRowState {
  linkTo: string;
}

class ListSectionHeaderRow extends React.Component<ListSectionHeaderRowProps, ListSectionHeaderRowState> {
  constructor(props: ListSectionHeaderRowProps) {
    super(props);
    this.state = { linkTo: this.props.linkTo ? this.props.linkTo : '/' };
  }

  render() {
    if (this.props.title === undefined && this.props.linkLabel === undefined) {
      return null;
    }
    return (
      <div className="ListSectionHeaderRow">
        <div className="title">{this.props.title}</div>
        <Link className="link" to={this.state.linkTo}>{this.props.linkLabel}</Link>
      </div>
    );
  }
}

export default ListSectionHeaderRow;
