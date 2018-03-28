import * as React from 'react';
import { Link } from 'react-router-dom';

import { ResourceListSection, Footer } from '../components';
import { LegislatorViewInfoRow, LegislatorStanceRow } from '../components';
import { LegislatorStanceRowDataProps } from '../components/LegislatorStanceRow';

import Http from '../http/Http';

import './Page.css';
import './LegislatorView.css';

interface LegislatorViewProps { }

interface LegislatorViewState {
  backLink: string;
  loadedLegislator: boolean;
  // tslint:disable-next-line:no-any
  legislatorData: any;
  legislatorStanceData: LegislatorStanceRowDataProps[];
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
      legislatorStanceData: [],
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
            headerTitle="CURRENT"
            rowClass={LegislatorStanceRow}
            loaded={true}
            data={[{isArchivedRow: false}, {isArchivedRow: false}]}
          />
          <ResourceListSection
            headerTitle="ARCHIVE"
            rowClass={LegislatorStanceRow}
            loaded={true}
            data={[{isArchivedRow: true}]}
          />
          <Footer />
        </div>
      </div>
    );
  }
}

export default LegislatorView;
