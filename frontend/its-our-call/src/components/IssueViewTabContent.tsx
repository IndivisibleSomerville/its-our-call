import * as React from 'react';

import IssueViewTopRow, { TimelineCheckpoint } from './IssueViewTopRow';
import CollapsibleMapSection, { CollapsibleMapSectionDataProps } from './CollapsibleMapSection';
import BowGraphRow, { StanceInfo } from './BowGraphRow';
import { Legislator as LegislatorData } from '../data/Legislator';

import './IssueViewTabContent.css';

export interface IssueViewTabContentProps {
  primaryType: string; // 'Senate' | 'House';
  // TODO: get legislators and their stances from the API
}

interface IssueViewTabContentState {
  isVoteInfoSectionExpanded: boolean;
  headerTitle: string;
  desiredOutcome: 'yea' | 'nay';
  timelineCheckpoints: TimelineCheckpoint[];
  stances: StanceInfo[];
  uncommittedLegislators: LegislatorData[];
  committedYeaLegislators: LegislatorData[];
  committedNayLegislators: LegislatorData[];
}

interface PlaceholderScenarioOpts {
  overwhelmingYea?: boolean;
  overwhelmingNay?: boolean;
}

let placeholderStances = function (opts: PlaceholderScenarioOpts): StanceInfo[] {
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

let placeholderLegislators = function (numFakeLegislators: number): LegislatorData[] {
  let toRet: LegislatorData[] = [];
  while (toRet.length < numFakeLegislators) {
    toRet.push({
      id: '1',
      fullName: 'Catherine Cortez Masto',
      partyAffiliation: 'dem',
      legislatorType: 'Senator',
      location: 'Nevada',
      phoneAnswerPercentage: '50%',
    });
  }
  return toRet;
};

class IssueViewTabContent extends React.Component<IssueViewTabContentProps, IssueViewTabContentState> {
  constructor(props: IssueViewTabContentProps) {
    super(props);
    let randomDesiredOutcome = (): 'yea' | 'nay' => { return Math.random() > .5 ? 'yea' : 'nay'; };
    let fakeStances = placeholderStances({overwhelmingNay: true});
    let countFakeStanceType = (type: 'yea' | 'nay' | 'uncommitted') => {
      return (reduced: number, stance: StanceInfo) => {
        if (type === stance.type) {
          reduced = reduced + 1;
        }
        return reduced;
      };
    };
    this.state = {
      desiredOutcome: randomDesiredOutcome(),
      isVoteInfoSectionExpanded: false,
      headerTitle: (props.primaryType + ' vote'),
      stances: fakeStances,
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
        }],
        uncommittedLegislators: placeholderLegislators(fakeStances.reduce(countFakeStanceType('uncommitted'), 0)),
        committedYeaLegislators: placeholderLegislators(fakeStances.reduce(countFakeStanceType('yea'), 0)),
        committedNayLegislators: placeholderLegislators(fakeStances.reduce(countFakeStanceType('nay'), 0)),
    };
  }

  componentWillReceiveProps(props: IssueViewTabContentProps) {
    this.setState({headerTitle: (props.primaryType + ' vote')});
  }

  render() {
    let uncommittedSectionData: CollapsibleMapSectionDataProps = {
      title: 'Uncommitted', showInfoButton: true, startExpanded: true,
      legislators: this.state.uncommittedLegislators,
      lastUpdated: '3 days ago',
      confidencePercentage: '90%',
    };
    let committedYeaSectionData: CollapsibleMapSectionDataProps = {
      title: 'Committed to Vote Yea', icon: 'frown', startExpanded: true,
      legislators: this.state.committedYeaLegislators,
      lastUpdated: '3 days ago',
      confidencePercentage: '90%',
    };
    let committedNaySectionData: CollapsibleMapSectionDataProps = {
      title: 'Committed to Vote Nay', icon: 'smile', startExpanded: true,
      legislators: this.state.committedNayLegislators,
      lastUpdated: '3 days ago',
      confidencePercentage: '90%',
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
          <CollapsibleMapSection key={0} data={uncommittedSectionData} />
          <CollapsibleMapSection key={1} data={committedYeaSectionData}/>
          <CollapsibleMapSection key={2} data={committedNaySectionData}/>
        </div>
      </div>
    );
  }
}

export default IssueViewTabContent;
