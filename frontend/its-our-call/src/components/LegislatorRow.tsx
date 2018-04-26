import * as React from 'react';
import { Link } from 'react-router-dom';

import { urlFmtLegislatorView } from '../pages/urls';

import { asResourceRow, ResourceRowProps } from './ResourceRow';
import BookmarkStar from './BookmarkStar';
import LegislatorBadge from './LegislatorBadge';

import { Legislator as LegislatorData } from '../data/Legislator';

import './LegislatorRow.css';

interface LegislatorRowWrappedProps extends ResourceRowProps {
  data: LegislatorRowDataProps;
}

export interface LegislatorRowDataProps {
  fullName: string;
  partyAffiliation: string;
  legislatorType: string;
  location: string;
  districtCode: string;
  isBookmarkRow: boolean;
  callLink?: string;
}

export function mapDataToLegislatorRowDataProps(l: LegislatorData): LegislatorRowDataProps {
  return {
    fullName: l.fullName,
    partyAffiliation: l.partyAffiliation,
    legislatorType: l.legislatorType,
    location: l.location,
    districtCode: l.districtCode ? l.districtCode : '',
    isBookmarkRow: true,
    callLink: '#',
  };
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
            <LegislatorBadge
              type={this.props.data.partyAffiliation}
              state={this.props.data.districtCode}
            />
          </div>
          <div className="middle">
            <div className="name">
              <Link to={urlFmtLegislatorView(this.state.legislatorId)}>
              {this.props.data.fullName}
              </Link>
            </div>
            <div className="desc">{this.props.data.legislatorType}, {this.props.data.location}</div>
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
