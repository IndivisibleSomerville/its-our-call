import * as React from 'react';
import { Link } from 'react-router-dom';

import { urlFmtLegislatorView } from '../pages/urls';

import BookmarkStar from './BookmarkStar';
import LegislatorBadge from './LegislatorBadge';

import './LegislatorViewInfoRow.css';

interface LegislatorViewInfoRowWrappedProps {
  // tslint:disable-next-line:no-any
  legislatorData: any;
}

export interface LegislatorViewInfoRowDataProps {
}

interface LegislatorViewInfoRowState {
  legislatorId: number;
}

class LegislatorViewInfoRow extends React.Component<LegislatorViewInfoRowWrappedProps, LegislatorViewInfoRowState> {
  constructor(props: LegislatorViewInfoRowWrappedProps) {
    super(props);
    this.state = { legislatorId: 1 }; // TODO: get the real id from data props
  }

  render() {
    return (
      <div className="LegislatorViewInfoRow">
        <div className="content">
          <div className="left">
            <LegislatorBadge type={'dem'}/>
          </div>
          <div className="middle">
            <div className="name">
              <Link to={urlFmtLegislatorView(this.state.legislatorId)}>
              Jack Sparrow
              </Link>
            </div>
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

export default LegislatorViewInfoRow;
