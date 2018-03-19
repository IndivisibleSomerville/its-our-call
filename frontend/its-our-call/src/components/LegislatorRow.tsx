import * as React from 'react';
import { asResourceRow, ResourceRowProps } from './ResourceRow';
import BookmarkStar from './BookmarkStar';
import LegislatorBadge from './LegislatorBadge';

import './LegislatorRow.css';

interface LegislatorRowProps extends ResourceRowProps { }

interface LegislatorRowState {
  // TODO: calculate actual state from props
}

class LegislatorRow extends React.Component<LegislatorRowProps, LegislatorRowState> {
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
            <BookmarkStar />
          </div>
      </div>
    </div>
    );
  }
}

export default asResourceRow(LegislatorRow);
