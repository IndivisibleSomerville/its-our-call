import * as React from 'react';

import { ResourceListSection, Footer } from '../components';
import { IssueRow, LegislatorRow } from '../components';

interface HomeProps { }

interface HomeState {
  loadedIssues: boolean;
  // tslint:disable-next-line:no-any
  issueData: any[];
  loadedLegislators: boolean;
  // tslint:disable-next-line:no-any
  legislatorData: any[];
}

class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    this.state = {
      loadedIssues: true,
      issueData: ['issue'],
      loadedLegislators: true,
      legislatorData: ['legislator', 'legislator'],
    };
  }

  render() {
    return (
      <div className="Page Home">
        <div className="full-height scrollable">
          <div className="intro">
            Lorem ipsum <button>arrow</button>
          </div>
          <ResourceListSection
            headerTitle="ISSUE"
            headerLink="/issues"
            rowClass={IssueRow}
            loaded={this.state.loadedIssues}
            data={this.state.issueData}
          />
          <ResourceListSection
            headerTitle="LEGISLATORS"
            headerLink="/legislators"
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
