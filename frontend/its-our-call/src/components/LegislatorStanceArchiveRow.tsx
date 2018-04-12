import * as React from 'react';
import { Link } from 'react-router-dom';
import { asResourceRow, ResourceRowProps } from './ResourceRow';

import * as urls from '../pages/urls';

import CommitmentInfo, { CommitmentType } from './CommitmentInfo';

import './LegislatorStanceRow.css';
import './LegislatorStanceArchiveRow.css';

interface LegislatorStanceArchiveRowWrappedProps extends ResourceRowProps {
  data: LegislatorStanceArchiveRowDataProps;
}

export interface LegislatorStanceArchiveRowDataProps {
  desiredType: CommitmentType;
  actualType:  CommitmentType;
  issueTitle: string;
  passedAt: string;
  lastUpdatedAt: string;
}

interface LegislatorStanceArchiveRowState {
  // TODO: calculate actual state from props
  issueId: number;
}

class LegislatorStanceArchiveRow extends React.Component<LegislatorStanceArchiveRowWrappedProps,
    LegislatorStanceArchiveRowState> {
  constructor(props: LegislatorStanceArchiveRowWrappedProps) {
    super(props);
    this.state = { issueId: 1 }; // TODO: get the real id from data props
  }

  render() {
    return (
      <div className="LegislatorStanceRow LegislatorStanceArchiveRow">
        <div className="content">
          <div className="left">
            <div className="title">
              <Link to={urls.urlFmtIssueView(this.state.issueId)}>
                {this.props.data.issueTitle}
              </Link>
            </div>
            <div className="passed-date">
              passed {this.props.data.passedAt}
            </div>
            <CommitmentInfo
              desiredType={this.props.data.desiredType}
              actualType={this.props.data.actualType}
            />
            <div className="last-update">
              last update: {this.props.data.lastUpdatedAt}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default asResourceRow(LegislatorStanceArchiveRow);
