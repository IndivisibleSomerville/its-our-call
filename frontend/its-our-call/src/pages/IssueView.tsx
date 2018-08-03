import * as React from 'react';
import * as queryString from 'query-string';

import Http from '../http/Http';

import './Page.css';
import './IssueView.css';

import { Footer } from '../components';
import IssueViewTabContent from '../components/IssueViewTabContent';
import { LegislatorRowDataProps, mapDataToLegislatorRowDataProps } from '../components/LegislatorRow';
import { StanceInfo } from '../components/BowGraphRow';
import { LegislatorStanceInfo, Legislator,
  placeholderHouseReps, placeholderSenatorReps } from '../data/Legislator';
import { Issue as IssueData } from '../data/Issue';

interface IssueViewProps { }

interface IssueViewState {
  isLoadingIssue: boolean;
  adjustForTiebreaker: boolean;
  issue?: IssueData;
  expandedOverview: boolean;
  selectedTabIndex: number;
  senatorMeta: LegislatorStanceMeta;
  houseRepMeta: LegislatorStanceMeta;
}

// metas are stored here at page level in order to avoid recalculating it every time the ui updates
interface LegislatorStanceMeta {
  stances: LegislatorStanceInfo[];
  stanceInfoArray: StanceInfo[];
  uncommittedLegislators: Legislator[];
  committedYeaLegislators: Legislator[];
  committedNayLegislators: Legislator[];
  uncommittedLegislatorProps: LegislatorRowDataProps[];
  committedYeaLegislatorProps: LegislatorRowDataProps[];
  committedNayLegislatorProps: LegislatorRowDataProps[];
}

// TODO: replace this with real data
interface PlaceholderLegislatorOpts {
  percentYea: number;
  percentNay: number;
  percentUncommitted: number;
  baseLegislators: Legislator[];
}

let buildLegislatorMeta = function (opts: PlaceholderLegislatorOpts): LegislatorStanceMeta {
  // generates stance data to display a random close-call vote scenario
  if (opts.percentYea + opts.percentNay + opts.percentUncommitted !== 100) {
    throw Error('invalid options: percents must add up to one hundred');
  }
  if (opts.baseLegislators.length === 0) {
    throw Error('invalid options: baseLegislators must exist');
  }
  let stances: LegislatorStanceInfo[] = [];
  let stanceInfoArray: StanceInfo[] = [];
  let yeas = Math.round(opts.baseLegislators.length * opts.percentYea / 100);
  let nays = Math.round(opts.baseLegislators.length * opts.percentNay / 100);
  let uncommitted = opts.baseLegislators.length - nays - yeas;
  let uncommittedLegislators: Legislator[] = [];
  let committedYeaLegislators: Legislator[] = [];
  let committedNayLegislators: Legislator[] = [];
  let uncommittedLegislatorProps: LegislatorRowDataProps[] = [];
  let committedYeaLegislatorProps: LegislatorRowDataProps[] = [];
  let committedNayLegislatorProps: LegislatorRowDataProps[] = [];

  opts.baseLegislators.forEach((l: Legislator) => {
    if (stances.length < nays) {
      stances.push({stance: 'nay', legislator: l});
      stanceInfoArray.push({type: 'nay', party: (l.partyAffiliation === 'dem' ? 'D' : 'R')});
      committedNayLegislators.push(l);
      committedNayLegislatorProps.push(mapDataToLegislatorRowDataProps(l));
    } else if (stances.length < (nays + yeas)) {
      stances.push({stance: 'yea', legislator: l});
      stanceInfoArray.push({type: 'yea', party: (l.partyAffiliation === 'dem' ? 'D' : 'R')});
      committedYeaLegislators.push(l);
      committedYeaLegislatorProps.push(mapDataToLegislatorRowDataProps(l));
    } else if (stances.length < uncommitted + nays + yeas) {
      stances.push({stance: 'uncommitted', legislator: l});
      stanceInfoArray.push({type: 'uncommitted', party: (l.partyAffiliation === 'dem' ? 'D' : 'R')});
      uncommittedLegislators.push(l);
      uncommittedLegislatorProps.push(mapDataToLegislatorRowDataProps(l));
    }
  });
  return {
    stances, stanceInfoArray,
    uncommittedLegislators, committedYeaLegislators, committedNayLegislators,
    uncommittedLegislatorProps, committedYeaLegislatorProps, committedNayLegislatorProps
  };
};

class IssueView extends React.Component<IssueViewProps, IssueViewState> {
  http = new Http();
  constructor(props: IssueViewProps) {
    super(props);
    let uncommittedLegislators: Legislator[] = [];
    let committedYeaLegislators: Legislator[] = [];
    let committedNayLegislators: Legislator[] = [];
    let uncommittedLegislatorProps: LegislatorRowDataProps[] = [];
    let committedYeaLegislatorProps: LegislatorRowDataProps[] = [];
    let committedNayLegislatorProps: LegislatorRowDataProps[] = [];
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
    this.state = {
      isLoadingIssue: true,
      expandedOverview: false,
      adjustForTiebreaker: true,
      selectedTabIndex: 0,
      senatorMeta: {stances: [], stanceInfoArray: [],
        uncommittedLegislators, committedYeaLegislators, committedNayLegislators,
        uncommittedLegislatorProps, committedYeaLegislatorProps, committedNayLegislatorProps},
      houseRepMeta: {stances: [], stanceInfoArray: [],
        uncommittedLegislators, committedYeaLegislators, committedNayLegislators,
        uncommittedLegislatorProps, committedYeaLegislatorProps, committedNayLegislatorProps
      }
    };
    this.fetchData = this.fetchData.bind(this);
    this.toggleOverview = this.toggleOverview.bind(this);
    this.selectedTabHeader = this.selectedTabHeader.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    // TODO: actually fetch the data, not using this hacky workaround for query params
    // tslint:disable:no-console
    let hashed = queryString.parse(location.search);
    let desiredOutcome: 'yea' | 'nay' = hashed.desiredOutcome ? hashed.desiredOutcome : 'nay';
    let requiresCloture = hashed.requiresThreeFifth ? hashed.requiresThreeFifth === 'true' : false;
    let adjustForTiebreaker = hashed.adjustForTiebreaker ? hashed.adjustForTiebreaker === 'true' : true;
    // ^ simple or three-fifths majority
    let percentYea = hashed.percentYea ? Number.parseInt(hashed.percentYea, 10) : 55;
    let percentNay = hashed.percentNay ? Number.parseInt(hashed.percentNay, 10) : 40;
    let percentUncommitted = hashed.percentUncommitted ? Number.parseInt(hashed.percentUncommitted, 10) : 5;
    this.setState({
      isLoadingIssue: false, expandedOverview: false,
      adjustForTiebreaker,
      issue: {
        title: 'Support the Pidgeon Recognition Act',
        imgSrc: 'https://i.imgur.com/54u7pkA.jpg',
        overview: 'Issue Overview. Cras vulputate, turpis site amet nisi nisi ullamcorper \
        Dico adhuc oblique sit ne, id homero eripuit appetere per. Vel persecuti forensibus \
        ea, te nec dicat summo. Debitis repudiare sea cu. Eos dolor consequat id, sed id \
        eius summo ubique, vero euripidis mei ex. Deserunt omittantur cum ad, eam ex tempor \
        vocent sanctus.',
        desiredOutcome,
        requiresCloture,
        sponsors: [
          {text: 'Jack Sparrow', url: 'http://google.com'}
        ],
        moreInformation: [
          {text: 'govtrack', url: 'http://govtrack.com'},
          {text: 'congress.gov', url: 'http://congress.gov'}
        ],
      },
      senatorMeta: buildLegislatorMeta({
        percentYea,
        percentNay,
        percentUncommitted,
        baseLegislators: placeholderSenatorReps,
      }),
      houseRepMeta: buildLegislatorMeta({
        percentYea,
        percentNay,
        percentUncommitted,
        baseLegislators: placeholderHouseReps,
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
    if (this.state.isLoadingIssue || this.state.issue === undefined) {
      return (<div className="Page IssueView loading">Loading...</div>);
    }
    // TODO: determine whether these are optional depending on the issue
    let senateOption: 'Senate' = 'Senate';
    let houseOption: 'House' = 'House';
    let sectionList = [senateOption, houseOption];
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

    let legislatorMeta = (this.state.selectedTabIndex === 0)
      ? this.state.senatorMeta : this.state.houseRepMeta;
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
                    adjustForTiebreaker={this.state.adjustForTiebreaker}
                    desiredOutcome={this.state.issue.desiredOutcome}
                    legislatorStances={legislatorMeta.stances}
                    stanceInfoArray={legislatorMeta.stanceInfoArray}
                    uncommittedLegislators={legislatorMeta.uncommittedLegislators}
                    committedYeaLegislators={legislatorMeta.committedYeaLegislators}
                    committedNayLegislators={legislatorMeta.committedNayLegislators}
                    uncommittedLegislatorProps={legislatorMeta.uncommittedLegislatorProps}
                    committedYeaLegislatorProps={legislatorMeta.committedYeaLegislatorProps}
                    committedNayLegislatorProps={legislatorMeta.committedNayLegislatorProps}
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
