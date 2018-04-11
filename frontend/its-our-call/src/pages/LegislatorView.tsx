import * as React from 'react';
import { Link } from 'react-router-dom';

import { ResourceListSection, Footer } from '../components';
import { LegislatorViewInfoRow, LegislatorStanceCurrentRow, LegislatorStanceArchiveRow } from '../components';
import { LegislatorStanceCurrentRowDataProps } from '../components/LegislatorStanceCurrentRow';
import { LegislatorStanceArchiveRowDataProps } from '../components/LegislatorStanceArchiveRow';

import Http from '../http/Http';

import './Page.css';
import './LegislatorView.css';

interface LegislatorViewProps { }

interface LegislatorViewState {
  backLink: string;
  loadedLegislator: boolean;
  // tslint:disable-next-line:no-any
  legislatorData: any;
  legislatorCurrentStanceData: LegislatorStanceCurrentRowDataProps[];
  legislatorArchiveStanceData: LegislatorStanceArchiveRowDataProps[];
}

class LegislatorView extends React.Component<LegislatorViewProps, LegislatorViewState> {
  http = new Http();
  constructor(props: LegislatorViewProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    this.state = {
      backLink: '',
      loadedLegislator: true,
      legislatorData: {},
      legislatorCurrentStanceData: [],
      legislatorArchiveStanceData: [],
    };
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
    let optionalBackLink: JSX.Element | null = (null);
    if (this.state.backLink.length !== 0) {
      optionalBackLink = (
        <Link className="back-link" to={this.state.backLink}>
          Pidgeon Recognition Act
        </Link>
      );
    }

    return (
      <div className="Page LegislatorView">
        <div className="full-height scrollable">
          {optionalBackLink}
          <LegislatorViewInfoRow
            legislatorData={this.state.legislatorData}
          />
          <ResourceListSection
            headerTitle="Current"
            rowClass={LegislatorStanceCurrentRow}
            loaded={true}
            data={[
              {issueTitle: 'Support the Pidgeon Recognition Act'},
              {issueTitle: 'Support the Pidgeon Recognition Act', desiredType: 'yea', actualType: 'yea'},
              {issueTitle: 'Oppose the Pidgeon Hunting Act', desiredType: 'nay', actualType: 'nay'},
            ]}
          />
          <ResourceListSection
            headerTitle="Archive"
            rowClass={LegislatorStanceArchiveRow}
            loaded={true}
            data={[
              {issueTitle: 'Support the Pidgeon Recognition Act 2', desiredType: 'yea', actualType: 'yea'},
              {issueTitle: 'Support the Pidgeon Recognition Act 2', desiredType: 'yea', actualType: 'nay'},
              {issueTitle: 'Oppose the Pidgeon Hunting Act 2', desiredType: 'nay', actualType: 'yea'},
              {issueTitle: 'Oppose the Pidgeon Hunting Act 2', desiredType: 'nay', actualType: 'nay'}
            ]}
          />
          <Footer />
        </div>
      </div>
    );
  }
}

export default LegislatorView;
