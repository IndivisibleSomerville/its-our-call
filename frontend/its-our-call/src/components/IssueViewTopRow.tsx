import * as React from 'react';
import { Link } from 'react-router-dom';

import PlusMinusButton from './PlusMinusButton';

import './IssueViewTopRow.css';

export interface TimelineCheckpoint {
  title: string;  // Senate, House, Not Enacted
  statusColor: string; // gray, orange, ...?
  active: boolean; // determines if text is grayed out
  timeline: TimelineInfo[]; // {'Introduced', '5/25/2017'}, {'Committee','Passed'}
}

export interface TimelineInfo {
  title: string;
  detail: string;
}

export interface LinkInfo {
  text: string;
  url?: string;
}

export interface IssueViewTopRowProps {
  startExpanded?: boolean;
  headerTitle: string; // Senate vote
  headerDetail: string; // in 11 days
  voteTitle: string; // s.123 The Pidgeon Recognition Act of 2017
  timelineCheckpoints: TimelineCheckpoint[];
  sponsors: LinkInfo[]; // {'Jack Sparrow', 'http://google.com'}
  moreInformation: LinkInfo[]; // {'govtrack', 'http://govtrack.com'}
}

interface IssueViewTopRowState {
  expanded: boolean;
}

class IssueViewTopRow extends React.Component<IssueViewTopRowProps, IssueViewTopRowState> {
  constructor(props: IssueViewTopRowProps) {
    super(props);
    this.state = {
      expanded: (props.startExpanded !== undefined ? props.startExpanded : true),
    };
  }

  render() {
    let sponsorsList = (null);
    if (this.props.sponsors.length > 0) {
      sponsorsList = (
        <div className="list sponsors-list">
          <div className="title">Sponsor(s)</div>
          {this.props.sponsors.map((l: LinkInfo, indx: number) => {
            if (l.url === undefined) {
              return (<div key={indx} className="sponsor">{l.text}</div>);
            }
            return (<Link key={indx} className="sponsor" to={l.url}>{l.text}</Link>);
          })}
        </div>
      );
    }
    let moreInfo = (null);
    if (this.props.moreInformation.length > 0) {
      sponsorsList = (
        <div className="list more-info-list">
          <div className="title">More Information</div>
          {this.props.moreInformation.map((l: LinkInfo, indx: number) => {
            if (l.url === undefined) {
              return (<div key={indx} className="more-info">{l.text}</div>);
            }
            return (<Link key={indx} className="more-info" to={l.url}>{l.text}</Link>);
          })}
        </div>
      );
    }
    return (
      <div className={'IssueViewTopRow ' + (this.state.expanded ? 'expanded' : 'collapsed')}>
        <div className="header">
          <PlusMinusButton
            showMinus={this.state.expanded}
            onClick={() => {this.setState({expanded: this.state.expanded}); }}
          />
          <div className="title">
            {this.props.headerTitle}
          </div>
          <div className="details">
            {this.props.headerDetail}
          </div>
        </div>
        <div className="content">
          <div className="title">
            {this.props.voteTitle}
          </div>
          <div className="timeline-sections">
            {this.props.timelineCheckpoints.map((c: TimelineCheckpoint, indx: number) => {
              let mainClasses = 'timeline-section';
              if (c.active === false) {
                mainClasses = mainClasses + ' disabled';
              }
              return (
                <div className={mainClasses} key={indx}>
                 <div className="left">{c.statusColor}</div>
                 <div className="right">
                   <div className="title">{c.title}</div>
                   {c.timeline.map((t: TimelineInfo, i: number) => {
                     return (
                       <div className="timeline-info" key={i}>
                         <div className="title">{t.title}</div>
                         <div className="detail">{t.detail}</div>
                       </div>
                     );
                   })}
                 </div>
                </div>
              );
            })}
          </div>
          {sponsorsList}
          {moreInfo}
        </div>
      </div>
    );
  }
}

export default IssueViewTopRow;
