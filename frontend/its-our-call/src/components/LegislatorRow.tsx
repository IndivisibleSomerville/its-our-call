import * as React from 'react';
import { asResourceRow, ResourceRowProps } from './ResourceRow';
import BookmarkStar from './BookmarkStar';
import LegislatorBadge from './LegislatorBadge';

import './LegislatorRow.css';

interface LegislatorRowWrappedProps extends ResourceRowProps {
  data: LegislatorRowDataProps;
}

export interface LegislatorRowDataProps {
  isBookmarkRow: boolean;
}

interface LegislatorRowState {
}

class LegislatorRow extends React.Component<LegislatorRowWrappedProps, LegislatorRowState> {
  constructor(props: LegislatorRowWrappedProps) {
    super(props);
  }

  render() {
    return (
      <div className="LegislatorRow">
        <div className="content">
          <div className="left">
            <LegislatorBadge type={'dem'}/>
          </div>
          <div className="middle">
            <div className="name">Jack Sparrow </div>
            <div className="desc">US Senator, Vermont </div>
          </div>
          <div className="right">
            <BookmarkStar isHidden={!this.props.data.isBookmarkRow}/>
          </div>
      </div>
    </div>
    );
  }
}

export default asResourceRow(LegislatorRow);
