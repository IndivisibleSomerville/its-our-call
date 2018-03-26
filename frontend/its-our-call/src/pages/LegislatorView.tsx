import * as React from 'react';
import { Link } from 'react-router-dom';

import Http from '../http/Http';

import { urlLegislatorsList } from './urls';

import './Page.css';
import './LegislatorView.css';

import { Footer } from '../components';

interface LegislatorViewProps { }

interface LegislatorViewState {
  loadedLegislator: boolean;
}

class LegislatorView extends React.Component<LegislatorViewProps, LegislatorViewState> {
  http = new Http();
  constructor(props: LegislatorViewProps) {
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
      <div className="Page LegislatorView">
        <div className="full-height scrollable">
          Individual Legislator Placeholder View
          <br/>
          <Link to={urlLegislatorsList()}>
            Back to Legislators
          </Link>
        </div>
        <Footer />
      </div>
    );
  }
}

export default LegislatorView;
