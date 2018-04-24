import * as React from 'react';

import IssueViewTopRow from './IssueViewTopRow';
import CollapsibleMapSection, { CollapsibleMapSectionDataProps } from './CollapsibleMapSection';
import BowGraphRow, { StanceInfo } from './BowGraphRow';
import { Legislator as LegislatorData, LegislatorStanceInfo } from '../data/Legislator';
import { Issue as IssueData, TimelineCheckpoint } from '../data/Issue';

import './IssueViewTabContent.css';

export interface IssueViewTabContentProps {
  primaryType: string; // 'Senate' | 'House';
  desiredOutcome: 'yea' | 'nay'; // 'yea' | 'nay';
  issue: IssueData;
  legislatorStances: LegislatorStanceInfo[];
  // TODO: get legislators and their stances from the API
}

interface IssueViewTabContentState {
  isVoteInfoSectionExpanded: boolean;
  headerTitle: string;
  timelineCheckpoints: TimelineCheckpoint[];
  stances: StanceInfo[];
  mapType: string;
  uncommittedLegislators: LegislatorData[];
  committedYeaLegislators: LegislatorData[];
  committedNayLegislators: LegislatorData[];
}

let partyLetter = (l: LegislatorData) => {
  return l.partyAffiliation === 'dem' ? 'D' : 'R';
};

class IssueViewTabContent extends React.Component<IssueViewTabContentProps, IssueViewTabContentState> {
  constructor(props: IssueViewTabContentProps) {
    super(props);
    this.filterLegislatorStances = this.filterLegislatorStances.bind(this);
    this.reduceLegislators = this.reduceLegislators.bind(this);
    this.buildMapType = this.buildMapType.bind(this);
    this.buildStancesFromArray = this.buildStancesFromArray.bind(this);
    this.buildTimelineCheckpointsFromProps = this.buildTimelineCheckpointsFromProps.bind(this);
    let ls = this.filterLegislatorStances(props.legislatorStances, props.primaryType);
    this.state = {
      isVoteInfoSectionExpanded: false,
      headerTitle: (props.primaryType + ' vote'),
      stances: this.buildStancesFromArray(ls),
      timelineCheckpoints: this.buildTimelineCheckpointsFromProps(props),
      uncommittedLegislators: this.reduceLegislators(ls, 'uncommitted'),
      committedYeaLegislators: this.reduceLegislators(ls, 'yea'),
      committedNayLegislators: this.reduceLegislators(ls, 'nay'),
      mapType: this.buildMapType(props),
    };
  }

  filterLegislatorStances(legislatorStances: LegislatorStanceInfo[], focusedType: string) {
      return legislatorStances.filter((l: LegislatorStanceInfo) => {
        return l.legislator.legislatorType === focusedType;
      });
  }

  reduceLegislators(legislatorStances: LegislatorStanceInfo[],
                    stance: 'yea' | 'nay' | 'uncommitted'): LegislatorData[] {
    return legislatorStances.reduce((reduce: LegislatorData[], l: LegislatorStanceInfo) => {
      if (l.stance === stance) {
        reduce.push(l.legislator);
      }
      return reduce;
    }, []);
  }

  buildMapType(props: IssueViewTabContentProps) {
    return (props.primaryType === 'Senate') ? 'state' : 'district';
  }

  buildStancesFromArray(legislatorStances: LegislatorStanceInfo[]): StanceInfo[] {
    return legislatorStances.map((l: LegislatorStanceInfo) => {
      return {type: l.stance, party: partyLetter(l.legislator) } as StanceInfo;
    });
  }

  buildTimelineCheckpointsFromProps (props: IssueViewTabContentProps) {
    // TODO: implement this from the API
    return [
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
      }
    ];
  }

  componentWillReceiveProps(props: IssueViewTabContentProps) {
    let ls = this.filterLegislatorStances(props.legislatorStances, props.primaryType);
    this.setState({
      headerTitle: (props.primaryType + ' vote'),
      stances: this.buildStancesFromArray(ls),
      uncommittedLegislators: this.reduceLegislators(ls, 'uncommitted'),
      committedYeaLegislators: this.reduceLegislators(ls, 'yea'),
      committedNayLegislators: this.reduceLegislators(ls, 'nay'),
      mapType: this.buildMapType(props),
    });
  }

  render() {
    return (
      <div className="IssueViewTabContent">
        <div className="content">
          <IssueViewTopRow
            startExpanded={true}
            headerTitle={this.state.headerTitle}
            headerDetail="in 11 days"
            voteTitle="S.123 The Pidgeon Recognition Act of 2017"
            timelineCheckpoints={this.state.timelineCheckpoints}
            sponsors={this.props.issue.sponsors}
            moreInformation={this.props.issue.moreInformation}
          />
          <BowGraphRow
            stances={this.state.stances}
            desiredOutcome={this.props.desiredOutcome}
            lastUpdated={'3 days ago'}
            confidencePercentage={'90%'}
          />
          <CollapsibleMapSection
            key={0}
            data={{
              title: 'Uncommitted',
              showInfoButton: true,
              startExpanded: true,
              legislators: this.state.uncommittedLegislators,
              lastUpdated: '3 days ago',
              confidencePercentage: '90%',
              mapType: this.state.mapType,
            } as CollapsibleMapSectionDataProps}
          />
          <CollapsibleMapSection
            key={1}
            data={{
              title: 'Committed to Vote Yea',
              icon: ((this.props.desiredOutcome === 'yea') ? 'smile' : 'frown'),
              startExpanded: true,
              legislators: this.state.committedYeaLegislators,
              lastUpdated: '3 days ago',
              confidencePercentage: '90%',
              mapType: this.state.mapType,
            } as CollapsibleMapSectionDataProps}
          />
          <CollapsibleMapSection
            key={2}
            data={{
              title: 'Committed to Vote Nay',
              icon: ((this.props.desiredOutcome === 'nay') ? 'smile' : 'frown'),
              startExpanded: true,
              legislators: this.state.committedNayLegislators,
              lastUpdated: '3 days ago',
              confidencePercentage: '90%',
              mapType: this.state.mapType,
            } as CollapsibleMapSectionDataProps}
          />
        </div>
      </div>
    );
  }
}

export default IssueViewTabContent;
