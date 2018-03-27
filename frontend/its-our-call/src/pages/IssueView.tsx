import * as React from 'react';
import { Link } from 'react-router-dom';

import Http from '../http/Http';

import './Page.css';
import './IssueView.css';

import { Footer } from '../components';

interface IssueViewProps { }

interface IssueViewState {
  loadedLegislator: boolean;
}

class IssueView extends React.Component<IssueViewProps, IssueViewState> {
  http = new Http();
  constructor(props: IssueViewProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    this.state = { loadedLegislator: true };
    this.fetchData = this.fetchData.bind(this);
    this.errorFetchingData = this.errorFetchingData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    //
  }
  // tslint:disable-next-line:no-any
  errorFetchingData(respError: any) {
    console.warn(respError);
  }

  render() {
    // TODO: if no bookmarks, show recently viewed
    return (
      <div className="Page IssueView">
        <div className="full-height scrollable">
          Individual Issue Placeholder View
          <br/>
          <br/>
          <Link className="placeholder-link" to={'/issues'}>
            Go to Issues List
          </Link>
          <br/>
          <br/>
          <Link className="placeholder-link" to={'/'}>
            Go to Main Page
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
}

export default IssueView;
