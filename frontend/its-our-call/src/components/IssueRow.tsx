import * as React from 'react';
import { asResourceRow, ResourceRowProps } from './ResourceRow';

interface IssueRowProps extends ResourceRowProps { }

interface IssueRowState {
  // TODO: calculate actual state from props
}

class IssueRow extends React.Component<IssueRowProps, IssueRowState> {
  render() {
    return (
      <div className="IssueRow">
      Support the Pidgeon Recognition Act <br/>
      Senate vote in 11 days <br/>
      6 more yeas needed
      </div>
    );
  }
}

export default asResourceRow(IssueRow);
