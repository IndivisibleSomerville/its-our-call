import * as React from 'react';

import Http from '../http/Http';

import './Page.css';
import './IssueList.css';

import { ResourceListSection, Footer } from '../components';
import { IssueRow } from '../components';
import { IssueRowDataProps } from '../components/IssueRow';

interface IssueListProps { }

interface IssueListState {
  loadedCurrentIssues: boolean;
  currentIssueData: IssueRowDataProps[];
  loadedArchivedIssues: boolean;
  archivedIssueData: IssueRowDataProps[];
}

class IssueList extends React.Component<IssueListProps, IssueListState> {
  http = new Http();
  constructor(props: IssueListProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    this.state = {
      loadedCurrentIssues: true,
      currentIssueData: [
        { isArchivedRow: false },
        { isArchivedRow: false }
      ], // TODO: real data
      loadedArchivedIssues: true,
      archivedIssueData: [
        { isArchivedRow: true },
        { isArchivedRow: true },
        { isArchivedRow: true },
        { isArchivedRow: true }
      ], // TODO: real data
    };
    this.fetchData = this.fetchData.bind(this);
    this.errorFetchingData = this.errorFetchingData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    // TODO: fetch each type of legislator & check local bookmarks
    // tslint:disable-next-line:no-any
    this.http.get('/api/issues').resp.then((IssueListResp: any) => {
      // console.warn(IssueListResp);
      // this.setState({legislatorData: [IssueListResp]});
    }).catch(this.errorFetchingData);
    // TODO: if no bookmarks, show recently viewed instead
  }
  // tslint:disable-next-line:no-any
  errorFetchingData(respError: any) {
    // console.warn(respError);
  }

  render() {
    return (
      <div className="Page IssueList">
        <div className="full-height scrollable">
          <div className="list-header">
            Issue List
          </div>
          <ResourceListSection
            headerTitle="CURRENT"
            rowClass={IssueRow}
            loaded={this.state.loadedCurrentIssues}
            data={this.state.currentIssueData}
          />
          <ResourceListSection
            headerTitle="ARCHIVE"
            rowClass={IssueRow}
            loaded={this.state.loadedArchivedIssues}
            data={this.state.archivedIssueData}
          />
          <Footer />
        </div>
      </div>
    );
  }
}

export default IssueList;
