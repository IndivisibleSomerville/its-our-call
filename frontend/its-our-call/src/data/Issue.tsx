// TODO: move to the data module
export interface Issue {
  title: string;
  imgSrc: string;
  overview: string;
  desiredOutcome: 'yea' | 'nay';
  // cloture: a senate-only case that requires 3/5ths majority to pass
  requiresCloture?: boolean;
  // TODO: fetch real stance data related to issue
  sponsors: IssueLinkInfo[];
  moreInformation: IssueLinkInfo[];
}

export interface IssueLinkInfo {
  text: string;
  url?: string;
}

export interface TimelineCheckpoint {
  title: string;  // Senate, House, Not Enacted
  statusColor: string; // gray, orange, ...?
  active: boolean; // determines if text is grayed out
  timeline: TimelineInfo[]; // {'Introduced', '5/25/2017'}, {'Committee','Passed'}
}

export interface TimelineInfo {
  title: string;
  detail: string;
  subdetail?: string;
}
