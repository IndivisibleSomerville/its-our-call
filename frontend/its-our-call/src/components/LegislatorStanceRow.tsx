import * as React from 'react';
import { Link } from 'react-router-dom';
import { asResourceRow, ResourceRowProps } from './ResourceRow';

import * as urls from '../pages/urls';

import './LegislatorStanceRow.css';

interface LegislatorStanceRowWrappedProps extends ResourceRowProps {
  data: LegislatorStanceRowDataProps;
}

export interface LegislatorStanceRowDataProps {
  isArchivedRow: boolean;
}

interface LegislatorStanceRowState {
  // TODO: calculate actual state from props
  issueId: number;
}

class LegislatorStanceRow extends React.Component<LegislatorStanceRowWrappedProps, LegislatorStanceRowState> {
  constructor(props: LegislatorStanceRowWrappedProps) {
    super(props);
    this.state = { issueId: 1 }; // TODO: get the real id from data props
  }

  render() {
    if (this.props.data.isArchivedRow) {
      return (
        <div className="LegislatorStanceRow">
          <div className="content">
            <div className="title">
              <Link to={urls.urlFmtIssueView(this.state.issueId)}>
                Support the Pidgeon Recognition Act
              </Link>
            </div>
            <div className="commitment-info">
              YEA
            </div>
            <div className="passed-date">
              passed 12/1/2017
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="LegislatorStanceRow">
        <div className="content">
          <div className="title">
            <Link to={urls.urlFmtIssueView(this.state.issueId)}>
              Support the Pidgeon Recognition Act
            </Link>
          </div>
          <div className="commitment-info">
            UNCOMMITTED
          </div>
          <div className="confidence">
            <div className="bold">our confidence:</div>
            <div className="percent">95%</div>
            <div className="info-btn">﹖</div>
          </div>
          <div className="sources">
            <div className="bold">sources:</div>
            <div className="detail">15 5 Calls reports</div>
          </div>
          <div className="last-update">
            last update: 1/29/2018 4:56 PM
          </div>
          <Link className="call-btn" to="#">
            <div className="text">
              call
            </div>
            <div className="arrow">
              ▶︎
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

export default asResourceRow(LegislatorStanceRow);
