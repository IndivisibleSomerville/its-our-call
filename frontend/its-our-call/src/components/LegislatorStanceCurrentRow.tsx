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
  issueTitle: boolean;
  desiredType?: CommitmentType;
  actualType?: CommitmentType;
}

interface LegislatorStanceCurrentRowState {
  // TODO: calculate actual state from props
  issueId: number;
  isFaded: boolean;
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
    this.state = { issueId: 1, isFaded }; // TODO: get the real id from data props
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
              senate vote in 11 days
            </div>
            <div className="votes-needed">
              <div className="bold">6</div>
              <div className="detail"> more yeas needed</div>
            </div>
            <div className="confidence">
              <div className="bold">our confidence:</div>
              <div className="percent">95%</div>
              <InfoButton />
            </div>
            <CommitmentInfo
              actualType={this.props.data.actualType}
              desiredType={this.props.data.desiredType}
            />
            <div className="sources">
              <div className="bold">number of reports</div>
              <div className="detail">15</div>
            </div>
            <div className="last-update">
              last update: 1/29/2018 4:56 PM
            </div>
          </div>
          <div className="right">
            <Link className="call-btn" to="#">
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
