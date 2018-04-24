import * as React from 'react';

import Http from '../http/Http';

import './Page.css';
import './IssueView.css';

import { Footer } from '../components';
import IssueViewTabContent from '../components/IssueViewTabContent';

interface IssueViewProps { }

interface IssueData {
  title: string;
  imgSrc: string;
  overview: string;
}

interface IssueViewState {
  loadedIssue: boolean;
  issue?: IssueData;
  expandedOverview: boolean;
  selectedTabIndex: number;
}

class IssueView extends React.Component<IssueViewProps, IssueViewState> {
  http = new Http();
  constructor(props: IssueViewProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    this.state = { loadedIssue: false, expandedOverview: false, selectedTabIndex: 0 };
    this.fetchData = this.fetchData.bind(this);
    this.errorFetchingData = this.errorFetchingData.bind(this);
    this.toggleOverview = this.toggleOverview.bind(this);
    this.selectedTabHeader = this.selectedTabHeader.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({
      loadedIssue: true, expandedOverview: false,
      issue: {
        title: 'Support the Pidgeon Recognition Act',
        imgSrc: 'https://i.imgur.com/54u7pkA.jpg',
        overview: 'Issue Overview. Cras vulputate, turpis site amet nisi nisi ullamcorper \
        Dico adhuc oblique sit ne, id homero eripuit appetere per. Vel persecuti forensibus \
        ea, te nec dicat summo. Debitis repudiare sea cu. Eos dolor consequat id, sed id \
        eius summo ubique, vero euripidis mei ex. Deserunt omittantur cum ad, eam ex tempor \
        vocent sanctus.',
      }
    });
  }
  // tslint:disable-next-line:no-any
  errorFetchingData(respError: any) {
    console.warn(respError);
  }

  toggleOverview() {
    this.setState({expandedOverview: !this.state.expandedOverview});
  }

  selectedTabHeader(index: number) {
    this.setState({selectedTabIndex: index});
    // TODO: animate and reload the other content
  }

  render() {
    if (!this.state.loadedIssue || this.state.issue === undefined) {
      return (<div>Loading</div>);
    }
    // TODO: determine whether these are optional depending on the issue
    let sectionList = ['Senate', 'House'];
    let optionClasses = ['first', 'second', 'third', 'fourth'];
    let headerOptions = sectionList.map((option: string, indx: number) => {
      return  (
        <div
          key={indx}
          onClick={() => { this.selectedTabHeader(indx); }}
          className={'btn ' + optionClasses[indx] + (indx === this.state.selectedTabIndex ? ' selected' : '')}
        >
          {option}
        </div>
      );
    });

    // show content depending on the most up-and-coming vote
    return (
      <div className="Page IssueView">
        <div className="full-height scrollable">
          <div className="content">
            <div className="info-row">
              <img className="background-image" src={this.state.issue.imgSrc} />
              <div className="title">{this.state.issue.title}</div>
            </div>
            <div className={'overview-wrapper ' + (this.state.expandedOverview ? 'expanded' : 'collapsed')}>
              <div className="description-overview">{this.state.issue.overview}</div>
              <div className="bottomShadow">&nbsp;</div>
              <div className="toggleButton" onClick={() => {this.toggleOverview(); }}>
                {this.state.expandedOverview ? 'less -' : 'more +'}
              </div>
            </div>
            <div className="tab-list-wrapper">
              <div className="tab-list-header">
                {headerOptions}
                <div className="moving-underline">
                  <div className="inner-content">&nbsp;</div>
                </div>
                <div className="bottomShadow">&nbsp;</div>
              </div>
              <div className={'tab-list-content-scrollable'}>
                <div className={'scrollable-content ' + optionClasses[this.state.selectedTabIndex]}>
                  <IssueViewTabContent primaryType={sectionList[this.state.selectedTabIndex]} />
                </div>
              </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
    );
  }
}

export default IssueView;
