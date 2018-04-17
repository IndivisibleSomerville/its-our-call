import * as React from 'react';
import { Link } from 'react-router-dom';
import { TiArrowRight } from 'react-icons/lib/ti/';

import Http from '../http/Http';

import './Page.css';
import './Home.css';

import * as urls from './urls';

import { ResourceListSection, Footer } from '../components';
import { IssueRow, LegislatorRow } from '../components';
import { LegislatorRowDataProps } from '../components/LegislatorRow';

interface HomeProps { }

interface HomeState {
  loadedIssues: boolean;
  // tslint:disable-next-line:no-any
  issueData: any[];
  loadedLegislators: boolean;
  // tslint:disable-next-line:no-any
  legislatorData: LegislatorRowDataProps[];
}

const infoRowText = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. \
Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s';

class Home extends React.Component<HomeProps, HomeState> {
  http = new Http();
  constructor(props: HomeProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    this.state = {
      loadedIssues: true,
      issueData: ['issue'],
      loadedLegislators: true,
      legislatorData: [
        {isBookmarkRow: true},
        {isBookmarkRow: true}, {isBookmarkRow: true}, {isBookmarkRow: true}],
    };
    this.fetchData = this.fetchData.bind(this);
    this.errorFetchingData = this.errorFetchingData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    // tslint:disable-next-line:no-any
    this.http.get('/api/issue').resp.then((issueListResp: any) => {
      // console.warn(issueListResp);
      // this.setState({issueData: [issueListResp]});
    }).catch(this.errorFetchingData);
    // tslint:disable-next-line:no-any
    this.http.get('/api/legislator').resp.then((legislatorListResp: any) => {
      // console.warn(legislatorListResp);
      // this.setState({legislatorData: [legislatorListResp]});
    }).catch(this.errorFetchingData);
  }
  // tslint:disable-next-line:no-any
  errorFetchingData(respError: any) {
    console.warn(respError);
  }

  render() {
    return (
      <div className="Page Home">
        <div className="full-height scrollable">
          <div className="InfoRow">
            <div className="text">{infoRowText}
              <Link className="more-button" to="/about"><TiArrowRight /></Link>
            </div>
          </div>
          <ResourceListSection
            headerTitle="ISSUE"
            headerLink={urls.urlIssuesList()}
            rowClass={IssueRow}
            loaded={this.state.loadedIssues}
            data={this.state.issueData}
          />
          <ResourceListSection
            headerTitle="LEGISLATORS"
            headerLink={urls.urlLegislatorsList()}
            rowClass={LegislatorRow}
            loaded={this.state.loadedLegislators}
            data={this.state.legislatorData}
          />
          <Footer />
        </div>
      </div>
    );
  }
}

export default Home;
