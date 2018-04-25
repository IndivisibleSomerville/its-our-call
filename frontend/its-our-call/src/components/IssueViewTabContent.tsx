import * as React from 'react';

import IssueViewTopRow from './IssueViewTopRow';
import CollapsibleMapSection, { CollapsibleMapSectionDataProps } from './CollapsibleMapSection';
import BowGraphRow, { StanceInfo } from './BowGraphRow';
import { Legislator as LegislatorData, LegislatorStanceInfo } from '../data/Legislator';
import { LegislatorRowDataProps } from './LegislatorRow';
import { Issue as IssueData, TimelineCheckpoint } from '../data/Issue';

import './IssueViewTabContent.css';

export interface IssueViewTabContentProps {
  primaryType: 'Senate' | 'House';
  desiredOutcome: 'yea' | 'nay'; // 'yea' | 'nay';
  issue: IssueData;
  legislatorStances: LegislatorStanceInfo[];
  // TODO: get legislators and their stances from the API
  stanceInfoArray: StanceInfo[];
  uncommittedLegislators: LegislatorData[];
  committedYeaLegislators: LegislatorData[];
  committedNayLegislators: LegislatorData[];
  uncommittedLegislatorProps: LegislatorRowDataProps[];
  committedYeaLegislatorProps: LegislatorRowDataProps[];
  committedNayLegislatorProps: LegislatorRowDataProps[];
}

interface IssueViewTabContentState {
  isVoteInfoSectionExpanded: boolean;
  headerTitle: string;
  timelineCheckpoints: TimelineCheckpoint[];
  mapType: string;
  isParsedLegislatorData: boolean;
}

class IssueViewTabContent extends React.Component<IssueViewTabContentProps, IssueViewTabContentState> {
  constructor(props: IssueViewTabContentProps) {
    super(props);
    this.buildMapType = this.buildMapType.bind(this);
    this.buildTimelineCheckpointsFromProps = this.buildTimelineCheckpointsFromProps.bind(this);
    this.setStateFromProps = this.setStateFromProps.bind(this);
    // tslint:disable:no-console
    this.state = {
      isVoteInfoSectionExpanded: false,
      headerTitle: (props.primaryType + ' vote'),
      timelineCheckpoints: this.buildTimelineCheckpointsFromProps(props),
      mapType: this.buildMapType(props),
      isParsedLegislatorData: false,
    };
  }

  buildMapType(props: IssueViewTabContentProps) {
    return (props.primaryType === 'Senate') ? 'state' : 'district';
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

  setStateFromProps(props: IssueViewTabContentProps) {
    this.setState({
      isParsedLegislatorData: true,
    });
  }

  componentDidMount() {
    this.setStateFromProps(this.props);
  }

  componentWillReceiveProps(props: IssueViewTabContentProps) {
    // tslint:disable:no-console
    this.setState({
      headerTitle: (props.primaryType + ' vote'),
      mapType: this.buildMapType(props),
      isParsedLegislatorData: false,
    });
    this.setStateFromProps(props);
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
            stances={this.props.stanceInfoArray}
            desiredOutcome={this.props.desiredOutcome}
            requiresCloture={this.props.issue.requiresCloture}
            lastUpdated={'3 days ago'}
            confidencePercentage={'90%'}
            adjustForTiebreaker={true}
            isLoading={!this.state.isParsedLegislatorData}
          />
          <CollapsibleMapSection
            key={0}
            data={{
              title: 'Uncommitted',
              showInfoButton: true,
              startExpanded: true,
              legislators: this.props.uncommittedLegislators,
              legislatorRowProps: this.props.uncommittedLegislatorProps,
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
              legislators: this.props.committedYeaLegislators,
              legislatorRowProps: this.props.committedYeaLegislatorProps,
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
              legislators: this.props.committedNayLegislators,
              legislatorRowProps: this.props.committedNayLegislatorProps,
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
