import * as React from 'react';

import Http from '../http/Http';

import './Page.css';
import './IssueView.css';

import { Footer } from '../components';
import IssueViewTabContent from '../components/IssueViewTabContent';
import { LegislatorStanceInfo, Legislator,
  placeholderHouseReps, placeholderSenatorReps } from '../data/Legislator';
import { Issue as IssueData } from '../data/Issue';

interface IssueViewProps { }

interface IssueViewState {
  loadedIssue: boolean;
  issue?: IssueData;
  expandedOverview: boolean;
  selectedTabIndex: number;
  legislatorStances: LegislatorStanceInfo[];
}

interface PlaceholderLegislatorOpts {
  percentYea: number;
  percentNay: number;
  percentUncommitted: number;
}

let buildLegislatorStances = function (opts: PlaceholderLegislatorOpts): LegislatorStanceInfo[] {
  // generates stance data to display a random close-call vote scenario
  if (opts.percentYea + opts.percentNay + opts.percentUncommitted !== 100) {
    throw Error('invalid options: percents must add up to one hundred');
  }
  let distributeStances = (array: Legislator[]): LegislatorStanceInfo[] => {
    let yeas = Math.round(array.length * opts.percentYea / 100);
    let nays = Math.round(array.length * opts.percentNay / 100);
    let uncommitted = array.length - nays - yeas;
    let stances: LegislatorStanceInfo[] = [];
    for (var ai = 0; ai < array.length; ai++) {
      let l: Legislator = array[ai];
      if (stances.length < nays) {
        stances.push({stance: 'nay', legislator: l});
      } else if (stances.length < (nays + yeas)) {
        stances.push({stance: 'yea', legislator: l});
      } else if (stances.length < uncommitted + nays + yeas) {
        stances.push({stance: 'uncommitted', legislator: l});
      }
    }
    return stances;
  };
  let toRet: LegislatorStanceInfo[] = [];
  return toRet.concat(distributeStances(placeholderHouseReps), distributeStances(placeholderSenatorReps));
};

class IssueView extends React.Component<IssueViewProps, IssueViewState> {
  http = new Http();
  constructor(props: IssueViewProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    this.state = { loadedIssue: false, expandedOverview: false, selectedTabIndex: 0, legislatorStances: []};
    this.fetchData = this.fetchData.bind(this);
    this.toggleOverview = this.toggleOverview.bind(this);
    this.selectedTabHeader = this.selectedTabHeader.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    // 'fetch' the data
    let desiredOutcome: 'yea' | 'nay' = 'yea';
    let percentYea = 10;
    let percentNay = 40;
    let percentUncommitted = 50;
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
        desiredOutcome,
        sponsors: [
          {text: 'Jack Sparrow', url: 'http://google.com'}
        ],
        moreInformation: [
          {text: 'govtrack', url: 'http://govtrack.com'},
          {text: 'congress.gov', url: 'http://congress.gov'}
        ],
      },
      legislatorStances: buildLegislatorStances({
        percentYea,
        percentNay,
        percentUncommitted
      }),
    });
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
                  <IssueViewTabContent
                    primaryType={sectionList[this.state.selectedTabIndex]}
                    issue={this.state.issue}
                    desiredOutcome={this.state.issue.desiredOutcome}
                    legislatorStances={this.state.legislatorStances}
                  />
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
