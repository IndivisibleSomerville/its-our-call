import * as React from 'react';

import IssueViewTopRow, { TimelineCheckpoint } from './IssueViewTopRow';
import CollapsibleMapSection from './CollapsibleMapSection';
import BowGraphRow from './BowGraphRow';

import './IssueViewTabContent.css';

export interface IssueViewTabContentProps {
  id: string; // for scrolling
  primaryType: string; // 'Senate' | 'House';
}

interface IssueViewTabContentState {
  isVoteInfoSectionExpanded: boolean;
  headerTitle: string;
  timelineCheckpoints: TimelineCheckpoint[];
}

class IssueViewTabContent extends React.Component<IssueViewTabContentProps, IssueViewTabContentState> {
  constructor(props: IssueViewTabContentProps) {
    super(props);
    this.state = {
      isVoteInfoSectionExpanded: false,
      headerTitle: (props.primaryType + ' vote'),
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
            stances={[]}
            desiredOutcome={'yea'}
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
