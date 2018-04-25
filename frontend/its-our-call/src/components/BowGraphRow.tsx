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
  isLoading: boolean;
  confidencePercentage: string;
  lastUpdated: string;
  desiredOutcome: OutcomeType;
  requiresCloture?: boolean; // 50% majority by default
  adjustForTiebreaker?: boolean;
  // since the VP can break ties, we need majority + 1 in some cases
  // this is different from our goalpost number
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
    let goalPost = props.requiresCloture ? 60 : 50;
    let uncommittedDCount = 0;
    let uncommittedRCount = 0;
    let yeaRCount = 0;
    let yeaDCount = 0;
    let nayRCount = 0;
    let nayDCount = 0;
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
    this.targetVotes = this.targetVotes.bind(this);
    this.isConclusive = this.isConclusive.bind(this);
    this.recalculateFromProps = this.recalculateFromProps.bind(this);
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
  targetVotes(): number {
    return this.props.adjustForTiebreaker ? (this.state.goalPost + 1) : this.state.goalPost;
  }
  remainingDesired(): number {
    return this.targetVotes() - this.desired();
  }
  isConclusive(): boolean {
    let target = this.targetVotes();
    return target < this.nays() || target < this.yeas();
  }

  recalculateFromProps(props: BowGraphRowProps) {
    let goalPost = props.requiresCloture
      ? Math.ceil(props.stances.length * 3 / 5) : Math.ceil(props.stances.length / 2);
    let uncommittedDCount = 0;
    let uncommittedRCount = 0;
    let yeaRCount = 0;
    let yeaDCount = 0;
    let nayRCount = 0;
    let nayDCount = 0;
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
    this.setState({
      uncommittedDCount, uncommittedRCount,
      yeaRCount, yeaDCount, nayRCount, nayDCount,
      goalPost,
    });
  }
  componentDidMount() {
    this.recalculateFromProps(this.props);
  }
  componentWillReceiveProps(props: BowGraphRowProps) {
    this.recalculateFromProps(props);
  }

  render() {
    if (this.props.isLoading) {
      return (
        <div className={'BowGraphRow loading'}>
          loading...
        </div>
      );
    }

    let undesiredPartyBreakdown = (<PartyBreakDown r={this.state.nayRCount} d={this.state.nayDCount}/>);
    let desiredPartyBreakdown = (<PartyBreakDown r={this.state.yeaRCount} d={this.state.yeaDCount}/>);
    if (this.props.desiredOutcome !== 'yea') {
      undesiredPartyBreakdown = (<PartyBreakDown r={this.state.yeaRCount} d={this.state.yeaDCount}/>);
      desiredPartyBreakdown = (<PartyBreakDown r={this.state.nayRCount} d={this.state.nayDCount}/>);
    }

    let optionalWill: JSX.Element | null = (null);
    let voteNumLabel = (
      <div className="inconclusive">
        <div className="number">{this.remainingDesired()}</div>
        <div className="number-details">
          more {this.props.desiredOutcome} vote{this.remainingDesired() === 1 ? '' : 's'}
          <br/>
          needed to {this.props.desiredOutcome === 'yea' ? 'pass' : 'defeat'}
        </div>
      </div>
    );

    if (this.isConclusive()) {
      let willSucceed: boolean = this.targetVotes() <= this.desired();
      let outcome = willSucceed ? this.props.desiredOutcome : (this.props.desiredOutcome === 'yea' ? 'nay' : 'yea');
      let dominantVotes = (outcome === 'yea' ? this.yeas() : this.nays());
      voteNumLabel = (
        <div className={'pass-defeat ' + (willSucceed ? 'right' : 'left')}>
          <div className={'top-will ' + (willSucceed ? 'right' : 'left')}>
            will
          </div>
          <div className={'verb ' + (willSucceed ? 'right' : 'left')}>
            {outcome === 'yea' ? 'pass' : 'defeat'}
          </div>
          <div className={'lower-details ' + (willSucceed ? 'right' : 'left')}>
            with {dominantVotes} {outcome} votes
          </div>
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
              goalpost={this.state.goalPost}
              goalpostOuterWidth={this.props.requiresCloture ? 20 : 60}
            />
            {optionalWill}
            {voteNumLabel}
          </div>
        </div>
      </div>
    );
  }
}

export default BowGraphRow;
