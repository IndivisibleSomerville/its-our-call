import * as React from 'react';
import InfoButton from './InfoButton';
import PartyBreakDown from './PartyBreakDown';

import './BowGraphRow.css';

interface StanceInfo {
  type: StanceType;
  party: PartyType;
}
type OutcomeType = 'yea' | 'nay';
type StanceType = OutcomeType | 'uncommitted';
type PartyType = 'R' | 'D';

export interface BowGraphRowProps {
  stances: StanceInfo[];
  confidencePercentage: string;
  lastUpdated: string;
  desiredOutcome: OutcomeType;
}

interface BowGraphRowState {
  uncommittedDCount: number;
  uncommittedRCount: number;
  yeaRCount: number;
  yeaDCount: number;
  nayRCount: number;
  nayDCount: number;
}

class BowGraphRow extends React.Component<BowGraphRowProps, BowGraphRowState> {
  constructor(props: BowGraphRowProps) {
    super(props);
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
    };
    this.yeas = this.yeas.bind(this);
    this.nays = this.nays.bind(this);
    this.uncommitted = this.uncommitted.bind(this);
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

  render() {
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
          <div className="graph">
            bow graph
          </div>
          <div className="left">
            <div className="top-details">
              <div className="bar-sample orange">&nbsp;</div>
              <div className="icon orange">☺</div>
              <div className="text orange">Yea</div>
              <div className="num orange">{this.yeas()}</div>
              <PartyBreakDown r={this.state.yeaRCount} d={this.state.yeaDCount}/>
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
              <div className="text green">Nay</div>
              <div className="num green">{this.nays()}</div>
              <PartyBreakDown r={this.state.nayRCount} d={this.state.nayDCount}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BowGraphRow;
