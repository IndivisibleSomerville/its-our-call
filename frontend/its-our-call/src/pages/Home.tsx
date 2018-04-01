import * as React from 'react';

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
Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, \
when an unknown printer took a galley of type and scrambled it to make a type \
specimen book. It has survived not only five centuries, but also the leap into \
electronic typesetting, remaining essentially unchanged. It was popularised in \
the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, \
and more recently with desktop publishing software like Aldus PageMaker including \
versions of Lorem Ipsum.';

interface InfoRowProps {
  text: string;
}
interface InfoRowState {
  expanded: boolean;
}
class InfoRow extends React.Component<InfoRowProps, InfoRowState> {
  constructor(props: InfoRowProps) {
    super(props);
    this.state = { expanded: false };
    this.expandClick = this.expandClick.bind(this);
  }
  expandClick() {
    this.setState({expanded: !this.state.expanded});
  }
  render() {
    let displayText = this.props.text;
    if (!this.state.expanded) {
      displayText = this.props.text.substr(0, 105);
    }
    return (
      <div className="InfoRow">
        <div className="text">{displayText}
          <button className="more-button" onClick={this.expandClick}>
            {this.state.expanded ? '←' : '→'}
          </button>
        </div>
      </div>
    );
  }
}

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
        {isBookmarkRow: false}, {isBookmarkRow: false}, {isBookmarkRow: false}],
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
          <InfoRow text={infoRowText} />
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
