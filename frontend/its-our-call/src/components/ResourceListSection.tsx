import * as React from 'react';

import ListSectionHeaderRow from './ListSectionHeaderRow';
import { ResourceRowProps } from './ResourceRow';

type RowComponentType = React.ComponentType<ResourceRowProps>;

interface ResourceListSectionProps {
  collapsible?: boolean;
  sticky?: boolean;
  // defaults to ResourceRow if not overridden
  rowClass: RowComponentType;
  loaded: boolean;
  // tslint:disable-next-line:no-any
  data: any[];
  // pass through the header properties
  headerTitle?: string;
  headerLink?: string;
  headerLinkLabel?: string;
}

interface ResourceListSectionState {
  headerLinkLabel: string;
}

class ResourceListSection extends React.Component<ResourceListSectionProps, ResourceListSectionState> {
  constructor(props: ResourceListSectionProps) {
     super(props);
     this.state = {
       headerLinkLabel: this.props.headerLinkLabel ? this.props.headerLinkLabel : 'see all',
     };
  }

  render() {
    let sectionBody = (<div className="loading">Loading...</div>);
    if (this.props.loaded) {
      sectionBody = (<div className="no-data">Nothing found.</div>);
      if (this.props.data.length > 0) {
        // tslint:disable-next-line:no-any
        let rows = this.props.data.map((datum: any, index: number) => {
          return (<this.props.rowClass key={index} data={datum} />);
        });
        sectionBody = (<div className="rows">{rows}</div>);
      }
    }
    return (
      <div className="ResourceListSection">
        <ListSectionHeaderRow
          title={this.props.headerTitle}
          linkLabel={this.state.headerLinkLabel}
          linkTo={this.props.headerLink}
        />
        {sectionBody}
      </div>
    );
  }
}

export default ResourceListSection;
