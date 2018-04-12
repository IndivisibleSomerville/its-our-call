import * as React from 'react';
import { Link } from 'react-router-dom';
import { asResourceRow, ResourceRowProps } from './ResourceRow';

import * as urls from '../pages/urls';

import CommitmentInfo, { CommitmentType } from './CommitmentInfo';
import InfoButton from './InfoButton';

import './LegislatorStanceRow.css';
import './LegislatorStanceCurrentRow.css';

interface LegislatorStanceCurrentRowWrappedProps extends ResourceRowProps {
  data: LegislatorStanceCurrentRowDataProps;
}

export interface LegislatorStanceCurrentRowDataProps {
  issueTitle: string;
  remainingTimeLabel: string;
  numNeededVotes: string;
  desiredType: CommitmentType;
  confidencePercent: string;
  numReports: string;
  lastUpdatedAt: string;
  actualType?: CommitmentType;
  callLink: string;
}

interface LegislatorStanceCurrentRowState {
  // TODO: calculate actual state from props
  issueId: number;
  isFaded: boolean;
  desiredTypeLabel: string;
}

class LegislatorStanceCurrentRow extends React.Component<
    LegislatorStanceCurrentRowWrappedProps,
    LegislatorStanceCurrentRowState
  > {
  constructor(props: LegislatorStanceCurrentRowWrappedProps) {
    super(props);
    let isFaded = false;
    if (props.data.desiredType && props.data.actualType) {
      isFaded = true;
    }
    let desiredTypeLabel = props.data.desiredType === 'yea' ? 'yeas' : 'nays';
    this.state = { issueId: 1, isFaded, desiredTypeLabel }; // TODO: get the real id from data props
  }

  render() {
    let contentColorClassName = '';
    if (this.state.isFaded) {
      contentColorClassName = 'faded';
    }
    return (
      <div className="LegislatorStanceRow LegislatorStanceCurrentRow">
        <div className={'content ' + contentColorClassName}>
          <div className="left">
            <div className="title">
              <Link to={urls.urlFmtIssueView(this.state.issueId)}>
                {this.props.data.issueTitle}
              </Link>
            </div>
            <div className="vote-deadline">
              {this.props.data.remainingTimeLabel}
            </div>
            <div className="votes-needed">
              <div className="bold">{this.props.data.numNeededVotes}</div>
              <div className="detail"> more {this.state.desiredTypeLabel} needed</div>
            </div>
            <div className="confidence">
              <div className="bold">our confidence:</div>
              <div className="percent">{this.props.data.confidencePercent}</div>
              <InfoButton />
            </div>
            <CommitmentInfo
              actualType={this.props.data.actualType}
              desiredType={this.props.data.desiredType}
            />
            <div className="sources">
              <div className="bold">number of reports</div>
              <div className="detail">{this.props.data.numReports}</div>
            </div>
            <div className="last-update">
              last update: {this.props.data.lastUpdatedAt}
            </div>
          </div>
          <div className="right">
            <Link className="call-btn" to={this.props.data.callLink}>
              <div className="text">
                call...
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default asResourceRow(LegislatorStanceCurrentRow);
