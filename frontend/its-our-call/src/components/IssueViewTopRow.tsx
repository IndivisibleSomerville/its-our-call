import * as React from 'react';
import { Link } from 'react-router-dom';
import { FaCircle as CircleIcon } from 'react-icons/lib/fa/';
import PlusMinusButton from './PlusMinusButton';

import { TimelineCheckpoint, TimelineInfo, IssueLinkInfo as LinkInfo } from '../data/Issue';

import './IssueViewTopRow.css';

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
              return (<div key={indx} className="item sponsor">{l.text}</div>);
            }
            return (<Link key={indx} className="item sponsor" to={l.url}>{l.text}</Link>);
          })}
        </div>
      );
    }
    let moreInfo = (null);
    if (this.props.moreInformation.length > 0) {
      moreInfo = (
        <div className="list more-info-list">
          <div className="title">More Information</div>
          {this.props.moreInformation.map((l: LinkInfo, indx: number) => {
            if (l.url === undefined) {
              return (<div key={indx} className="item more-info">{l.text}</div>);
            }
            return (<Link key={indx} className="item more-info" to={l.url}>{l.text}</Link>);
          })}
        </div>
      );
    }
    return (
      <div className={'IssueViewTopRow ' + (this.state.expanded ? 'expanded' : 'collapsed')}>
        <div className="header">
          <PlusMinusButton
            showMinus={this.state.expanded}
            onClick={() => {this.setState({expanded: !this.state.expanded}); }}
          />
          <div className="title">
            {this.props.headerTitle}
          </div>
          <div className="details">
            {this.props.headerDetail}
          </div>
        </div>
        <div className="top-row-content">
          <div className="topShadow">&nbsp;</div>
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
                 <div className={'left ' + c.statusColor}><CircleIcon /></div>
                 <div className="right">
                   <div className="title">{c.title}</div>
                   {c.timeline.map((t: TimelineInfo, i: number) => {
                     return (
                       <div className="timeline-info" key={i}>
                         <div className="title">{t.title}</div>
                         <div className="detail">{t.detail}</div>
                         <div className="subdetail">{t.subdetail}</div>
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
