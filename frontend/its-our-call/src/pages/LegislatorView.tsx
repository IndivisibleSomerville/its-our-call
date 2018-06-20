import * as React from 'react';

import { ResourceListSection, Footer } from '../components';
import { LegislatorViewInfoRow, LegislatorStanceCurrentRow, LegislatorStanceArchiveRow } from '../components';
import { LegislatorStanceCurrentRowDataProps } from '../components/LegislatorStanceCurrentRow';
import { LegislatorStanceArchiveRowDataProps } from '../components/LegislatorStanceArchiveRow';

import Http from '../http/Http';

import './Page.css';
import './LegislatorView.css';

import { Legislator as LegislatorData,
  placeholderHouseReps } from '../data/Legislator';

interface LegislatorViewProps { }

interface LegislatorViewState {
  backLink: string;
  loadedLegislator: boolean;
  // tslint:disable-next-line:no-any
  legislatorData?: LegislatorData;
  legislatorCurrentStanceData: LegislatorStanceCurrentRowDataProps[];
  legislatorArchiveStanceData: LegislatorStanceArchiveRowDataProps[];
}

class LegislatorView extends React.Component<LegislatorViewProps, LegislatorViewState> {
  http = new Http();
  constructor(props: LegislatorViewProps) {
    super(props);
    this.state = {
      backLink: '',
      loadedLegislator: false,
      legislatorData: undefined,
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
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    let legislatorData = placeholderHouseReps[0];
    // convert the api data to the row data props
    let legislatorCurrentStanceData: LegislatorStanceCurrentRowDataProps[] = [
      {
        desiredType: 'yea', numNeededVotes: '2',
        issueTitle: 'Support the Pidgeon Recognition Act',
        remainingTimeLabel: 'senate vote in 1 day',
        confidencePercent: '0%', numReports: '0', lastUpdatedAt: '1/29/2018 4:56 PM',
        callLink: '#1'
      },
      {
        actualType: 'yea', desiredType: 'yea', numNeededVotes: '11',
        issueTitle: 'Support the Pidgeon Recognition Act',
        remainingTimeLabel: 'senate vote in 3 days',
        confidencePercent: '95%', numReports: '15', lastUpdatedAt: '2/19/2018 1:56 PM',
        callLink: '#2'
      },
      {
        actualType: 'nay', desiredType: 'nay', numNeededVotes: '5',
        issueTitle: 'Oppose the Pidgeon Hunting Act',
        remainingTimeLabel: 'senate vote in 11 days',
        confidencePercent: '35%', numReports: '4', lastUpdatedAt: '4/11/2018 3:56 PM',
        callLink: '#3'
      },
    ];
    let legislatorArchiveStanceData: LegislatorStanceArchiveRowDataProps[] = [
      {
        issueTitle: 'Support the Pidgeon Recognition Act 2', desiredType: 'yea', actualType: 'yea',
        passedAt: '4/1/2018', lastUpdatedAt: '2/29/2018 4:56 PM',
      },
      {
        issueTitle: 'Support the Pidgeon Recognition Act 3', desiredType: 'yea', actualType: 'nay',
        passedAt: '3/15/2018', lastUpdatedAt: '1/29/2018 4:59 PM',
      },
      {
        issueTitle: 'Oppose the Pidgeon Hunting Act 2', desiredType: 'nay', actualType: 'yea',
        passedAt: '1/21/2018', lastUpdatedAt: '11/19/2017 4:51 PM',
      },
      {
        issueTitle: 'Oppose the Pidgeon Hunting Act 3', desiredType: 'nay', actualType: 'nay',
        passedAt: '12/1/2017', lastUpdatedAt: '4/29/2017 4:50 PM',
      }
    ];
    let loadedLegislator = true;
    this.setState({
      loadedLegislator,
      legislatorData,
      legislatorCurrentStanceData,
      legislatorArchiveStanceData
    });
  }
  // tslint:disable-next-line:no-any
  errorFetchingData(respError: any) {
    console.warn(respError);
  }

  render() {
    let legislatorData = this.state.legislatorData;
    if (legislatorData === undefined || !this.state.loadedLegislator) {
      return (
        <div className="Page LegislatorView">
          <div className="full-height scrollable">
            &nbsp;
          </div>
        </div>
      );
    }
    return (
      <div className="Page LegislatorView">
        <div className="full-height scrollable">
          <LegislatorViewInfoRow
            legislatorData={legislatorData}
          />
          <ResourceListSection
            headerTitle="Current"
            rowClass={LegislatorStanceCurrentRow}
            dataLoaded={true}
            data={this.state.legislatorCurrentStanceData}
          />
          <ResourceListSection
            headerTitle="Archive"
            rowClass={LegislatorStanceArchiveRow}
            dataLoaded={true}
            data={this.state.legislatorArchiveStanceData}
          />
          <Footer />
        </div>
      </div>
    );
  }
}

export default LegislatorView;
