import * as React from 'react';
import InfoButton from './InfoButton';
import PartyBreakDown from './PartyBreakDown';
import BowGraphSVG from './BowGraphSVG';

import './BowGraphRow.css';

export interface StanceInfo {
  type: StanceType;
  party: PartyType;
}
export type OutcomeType = 'yea' | 'nay';
type StanceType = OutcomeType | 'uncommitted';
type PartyType = 'R' | 'D';

export interface BowGraphRowProps {
  stances: StanceInfo[];
  confidencePercentage: string;
  lastUpdated: string;
  desiredOutcome: OutcomeType;
  totalVotesNeeded?: number; // 50 by default
}

interface BowGraphRowState {
  uncommittedDCount: number;
  uncommittedRCount: number;
  yeaRCount: number;
  yeaDCount: number;
  nayRCount: number;
  nayDCount: number;
  goalPost: number;
}

class BowGraphRow extends React.Component<BowGraphRowProps, BowGraphRowState> {
  constructor(props: BowGraphRowProps) {
    super(props);
    let goalPost = props.totalVotesNeeded ? props.totalVotesNeeded : 50;
    let uncommittedDCount = 0;
    let uncommittedRCount = 0;
    let yeaRCount = 0;
    let yeaDCount = 0;
    let nayRCount = 0;
    let nayDCount = 0;
    // TODO: update with real data
    for (var s of props.stances) {
      if (s.party === 'R') {
        switch (s.type) {
          case 'yea':
            yeaRCount = yeaRCount + 1;
            break;
          case 'nay':
            nayRCount = nayRCount + 1;
            break;
          case 'uncommitted':
            uncommittedRCount = uncommittedRCount + 1;
            break;
          default:
        }
      } else if (s.party === 'D') {
        switch (s.type) {
          case 'yea':
            yeaDCount = yeaDCount + 1;
            break;
          case 'nay':
            nayDCount = nayDCount + 1;
            break;
          case 'uncommitted':
            uncommittedDCount = uncommittedDCount + 1;
            break;
          default:
        }

      }
    }

    this.state = {
      uncommittedDCount, uncommittedRCount,
      yeaRCount, yeaDCount, nayRCount, nayDCount,
      goalPost,
    };
    this.yeas = this.yeas.bind(this);
    this.nays = this.nays.bind(this);
    this.uncommitted = this.uncommitted.bind(this);
    this.desired = this.desired.bind(this);
    this.undesired = this.undesired.bind(this);
    this.remainingDesired = this.remainingDesired.bind(this);
  }

  yeas() {
    return this.state.yeaDCount + this.state.yeaRCount;
  }

  nays() {
    return this.state.nayDCount + this.state.nayRCount;
  }

  uncommitted() {
    return this.state.uncommittedDCount + this.state.uncommittedRCount;
  }

  desired() {
    if (this.props.desiredOutcome === 'yea') {
      return this.yeas();
    }
    return this.nays();
  }
  undesired() {
    if (this.props.desiredOutcome === 'yea') {
      return this.nays();
    }
    return this.yeas();
  }
  remainingDesired () {
      if (this.state.goalPost > 0) {
        return this.state.goalPost - this.desired();
      }
      return 0;
  }

  render() {
    let goalPost = 50;
    //     this.props.desiredOutcome === 'yea'
    let undesiredPartyBreakdown = (<PartyBreakDown r={this.state.nayRCount} d={this.state.nayDCount}/>);
    let desiredPartyBreakdown = (<PartyBreakDown r={this.state.yeaRCount} d={this.state.yeaDCount}/>);
    if (this.props.desiredOutcome !== 'yea') {
      undesiredPartyBreakdown = (<PartyBreakDown r={this.state.yeaRCount} d={this.state.yeaDCount}/>);
      desiredPartyBreakdown = (<PartyBreakDown r={this.state.nayRCount} d={this.state.nayDCount}/>);
    }

    let optionalWill: JSX.Element | null = (null);
    let voteNumLabel = (<div className="center-label">{this.remainingDesired()}</div>);
    let voteGoalDetails = (
      <div className="center-details">more {this.props.desiredOutcome} votes
        <br/>needed to {this.props.desiredOutcome === 'yea' ? 'pass' : 'defeat'}
      </div>
    );

    if (this.remainingDesired() < 0) {
      optionalWill = (<div className="top">will</div>);
      voteNumLabel = (<div className="center-label">{-this.remainingDesired()}</div>);
      voteGoalDetails = (
        <div className="center-details">more than needed
          <br/>issue likely to {this.props.desiredOutcome === 'yea' ? 'pass' : 'defeat'}
        </div>
      );
    }

    return (
      <div className={'BowGraphRow'}>
        <div className="header">
          <div className="middle">
            <div className="bar-sample uncommitted">&nbsp;</div>
            <div className="text">Uncommitted</div>
            <div className="num">{this.uncommitted()}</div>
            <PartyBreakDown
              r={this.state.uncommittedRCount}
              d={this.state.uncommittedDCount}
            />
          </div>
          <InfoButton />
        </div>
        <div className="content">
          <div className="left">
            <div className="top-details">
              <div className="bar-sample orange">&nbsp;</div>
              <div className="icon orange">☹︎</div>
              <div className="text orange">{this.props.desiredOutcome === 'yea' ? 'nay' : 'yea'}</div>
              <div className="num orange">{this.undesired()}</div>
              {undesiredPartyBreakdown}
            </div>
            <div className="bottom-details">
              <div className="confidence">
                our confidence: {this.props.confidencePercentage}
              </div>
               <InfoButton />
              <div className="last-update">
                last update: {this.props.lastUpdated}
              </div>
            </div>
          </div>
          <div className="right">
            <div className="top-details">
              <div className="bar-sample green">&nbsp;</div>
              <div className="icon green">☺</div>
              <div className="text green">{this.props.desiredOutcome}</div>
              <div className="num green">{this.desired()}</div>
              {desiredPartyBreakdown}
            </div>
          </div>
          <div className="graph">
            <BowGraphSVG
              numOrange={this.undesired()}
              numWhite={this.uncommitted()}
              numGreen={this.desired()}
              goalpost={goalPost}
              goalpostOuterWidth={goalPost === 50 ? 30 : 20}
            />
            {optionalWill}
            {voteNumLabel}
            {voteGoalDetails}
          </div>
        </div>
      </div>
    );
  }
}

export default BowGraphRow;
