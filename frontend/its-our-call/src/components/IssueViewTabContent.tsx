import * as React from 'react';

import IssueViewTopRow, { TimelineCheckpoint } from './IssueViewTopRow';
import CollapsibleMapSection from './CollapsibleMapSection';
import BowGraphRow, { StanceInfo } from './BowGraphRow';

import './IssueViewTabContent.css';

export interface IssueViewTabContentProps {
  id: string; // for scrolling
  primaryType: string; // 'Senate' | 'House';
  // legislators by stance
}

interface IssueViewTabContentState {
  isVoteInfoSectionExpanded: boolean;
  headerTitle: string;
  desiredOutcome: 'yea' | 'nay';
  timelineCheckpoints: TimelineCheckpoint[];
  stances: StanceInfo[];
}

interface ScenarioOpts {
  overwhelmingYea?: boolean;
  overwhelmingNay?: boolean;
}

let placeholderStances = function (opts: ScenarioOpts): StanceInfo[] {
  // generates stance data to display a random close-call vote scenario
  let toRet: StanceInfo[] = [];
  let randomParty = (): 'R' | 'D' => { return Math.random() > .5 ? 'D' : 'R'; };
  let totalVoters = 100;
  let baseYeas = opts.overwhelmingYea ? 70 : (opts.overwhelmingNay ? 10 : 40);
  let baseNays = opts.overwhelmingYea ? 10 : (opts.overwhelmingNay ? 70 : 40);
  let yeas = Math.floor(Math.random() * 5) + baseYeas;
  let nays = Math.floor(Math.random() * 5) + baseNays;
  while (toRet.length < nays) {
    toRet.push({type: 'nay', party: randomParty()});
  }
  while (toRet.length < (nays + yeas)) {
    toRet.push({type: 'yea', party: randomParty()});
  }
  while (toRet.length < totalVoters) {
    toRet.push({type: 'uncommitted', party: randomParty()});
  }
  return toRet;
};

class IssueViewTabContent extends React.Component<IssueViewTabContentProps, IssueViewTabContentState> {
  constructor(props: IssueViewTabContentProps) {
    super(props);
    let randomOutcome = (): 'yea' | 'nay' => { return Math.random() > .5 ? 'yea' : 'nay'; };
    this.state = {
      desiredOutcome: randomOutcome(),
      isVoteInfoSectionExpanded: false,
      headerTitle: (props.primaryType + ' vote'),
      stances: placeholderStances({overwhelmingNay: true}),
      timelineCheckpoints: [
        {
          title: 'Senate',
          statusColor: 'inProgress',
          active: true,
          timeline: [
            {title: 'Introduced', detail: '5/25/2017'},
            {title: 'Committee', detail: 'Passed', subdetail: 'Senate Committee on Feather Affairs'},
            {title: 'Debate', detail: 'in 2 days'},
            {title: 'Vote', detail: 'date TBD'},
          ]
        }, {
          title: 'House',
          statusColor: 'disabled',
          active: false,
          timeline: [],
        }, {
          title: 'Not Enacted',
          statusColor: 'disabled',
          active: false,
          timeline: [],
        }]
    };
  }

  componentWillReceiveProps(props: IssueViewTabContentProps) {
    this.setState({headerTitle: (props.primaryType + ' vote')});
  }

  render() {
    let uncommittedSectionData = {
      title: 'Uncommitted', showInfoButton: true, startExpanded: true,
      legislators: []
    };
    let committedYeaSectionData = {
      title: 'Committed to Vote Yea', icon: 'frown', startExpanded: true,
      legislators: []
    };
    let committedNaySectionData = {
      title: 'Committed to Vote Nay', icon: 'smile', startExpanded: true,
      legislators: []
    };
    return (
      <div className="IssueViewTabContent">
        <div className="content">
          <IssueViewTopRow
            startExpanded={true}
            headerTitle={this.state.headerTitle}
            headerDetail="in 11 days"
            voteTitle="S.123 The Pidgeon Recognition Act of 2017"
            timelineCheckpoints={this.state.timelineCheckpoints}
            sponsors={[
              {text: 'Jack Sparrow', url: 'http://google.com'}
            ]}
            moreInformation={[
              {text: 'govtrack', url: 'http://govtrack.com'},
              {text: 'congress.gov', url: 'http://congress.gov'}
            ]}
          />
          <BowGraphRow
            stances={this.state.stances}
            desiredOutcome={this.state.desiredOutcome}
            lastUpdated={'3 days ago'}
            confidencePercentage={'90%'}
          />
          <CollapsibleMapSection key={0} data={uncommittedSectionData}/>
          <CollapsibleMapSection key={1} data={committedYeaSectionData}/>
          <CollapsibleMapSection key={2} data={committedNaySectionData}/>
        </div>
      </div>
    );
  }
}

export default IssueViewTabContent;
