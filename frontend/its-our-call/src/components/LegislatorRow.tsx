import * as React from 'react';
import { Link } from 'react-router-dom';

import { urlFmtLegislatorView } from '../pages/urls';

import { asResourceRow, ResourceRowProps } from './ResourceRow';
import BookmarkStar from './BookmarkStar';
import LegislatorBadge from './LegislatorBadge';

import './LegislatorRow.css';

interface LegislatorRowWrappedProps extends ResourceRowProps {
  data: LegislatorRowDataProps;
}

export interface LegislatorRowDataProps {
  isBookmarkRow: boolean;
  callLink?: string;
}

interface LegislatorRowState {
  legislatorId: number;
}

class LegislatorRow extends React.Component<LegislatorRowWrappedProps, LegislatorRowState> {
  constructor(props: LegislatorRowWrappedProps) {
    super(props);
    this.state = { legislatorId: 1 }; // TODO: get the real data from props.data
    this.buildCallButton = this.buildCallButton.bind(this);
  }

  buildCallButton() {
    if (this.props.data.callLink === undefined) {
      return (null);
    }
    return (
      <Link className="call-btn" to={this.props.data.callLink}>
        <div className="text">
          call...
        </div>
      </Link>
    );
  }
  render() {
    return (
      <div className="LegislatorRow">
        <div className="content">
          <div className="left">
            <LegislatorBadge type={'dem'} state={'VT'}/>
          </div>
          <div className="middle">
            <div className="name">
              <Link to={urlFmtLegislatorView(this.state.legislatorId)}>
              Jack Sparrow
              </Link>
            </div>
            <div className="desc">Senator, Vermont </div>
          </div>
          <div className="right">
            <BookmarkStar isHidden={!this.props.data.isBookmarkRow}/>
          </div>
      </div>
      {this.buildCallButton()}
    </div>
    );
  }
}

export default asResourceRow(LegislatorRow);
