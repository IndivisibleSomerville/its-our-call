import * as React from 'react';
import { Link } from 'react-router-dom';
import { asResourceRow, ResourceRowProps } from './ResourceRow';

import './IssueRow.css';

interface IssueRowWrappedProps extends ResourceRowProps {
  data: IssueRowDataProps;
}

export interface IssueRowDataProps {
  isArchivedRow: boolean;
}

interface IssueRowState {
  // TODO: calculate actual state from props
  issueId: number;
}

class IssueRow extends React.Component<IssueRowWrappedProps, IssueRowState> {
  constructor(props: IssueRowWrappedProps) {
    super(props);
    this.state = { issueId: 1 }; // TODO: get the real id from data props
  }

  render() {
    return (
      <div className="IssueRow">
        <div className="content">
          <div className="title">
            <Link to={'/issues/' + this.state.issueId}>
              Support the Pidgeon Recognition Act
            </Link>
          </div>
          <div className="vote-deadline">
            senate vote in 11 days
          </div>
          <div className="needed-votes">
            <div className="bold">6</div>
            <div className="desc">more yeas needed</div>
          </div>
          <div className="confidence">
            <div className="bold">our confidence:</div>
            <div className="percent">95%</div>
            <div className="info-btn">﹖</div>
          </div>
        </div>
      </div>
    );
  }
}

export default asResourceRow(IssueRow);
