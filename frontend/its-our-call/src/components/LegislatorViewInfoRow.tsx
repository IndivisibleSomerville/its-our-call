import * as React from 'react';
import { Link } from 'react-router-dom';

import { urlFmtLegislatorView } from '../pages/urls';

import BookmarkStar from './BookmarkStar';
import ImageBadge from './ImageBadge';

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
            <div className="name">
              Catherine Cortez Masto
            </div>
            <div className="desc">Senator, Nevada </div>
          </div>
          <BookmarkStar />
          <div className="right">
            <ImageBadge type={'dem'}/>
          </div>
          <div className="additional-desc">answers the phone 50% of the time</div>
          <div className="full-profile">
            <Link to={urlFmtLegislatorView(this.state.legislatorId)}>
              Full Profile
            </Link>
          </div>
        </div>
    </div>
    );
  }
}

export default LegislatorViewInfoRow;
