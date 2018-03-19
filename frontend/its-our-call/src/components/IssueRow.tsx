import * as React from 'react';
import { asResourceRow, ResourceRowProps } from './ResourceRow';

import './IssueRow.css';

interface IssueRowProps extends ResourceRowProps { }

interface IssueRowState {
  // TODO: calculate actual state from props
}

class IssueRow extends React.Component<IssueRowProps, IssueRowState> {
  render() {
    return (
      <div className="IssueRow">
        <div className="content">
          <div className="title">
            Support the Pidgeon Recognition Act
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
