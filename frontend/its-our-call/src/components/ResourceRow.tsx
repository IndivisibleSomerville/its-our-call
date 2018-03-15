import * as React from 'react';

export interface ResourceRowProps {
  key: number;
  // tslint:disable-next-line:no-any
  data: any; // process this into the state within the constructor
}

export const asResourceRow = <P extends ResourceRowProps>(UnwrappedComponent: React.ComponentType<P>) =>
  class WithResourceRowProps extends React.Component<P & ResourceRowProps> {
    render() {
      return (
        <UnwrappedComponent
          {...this.props}
        />
      );
    }
};

// A simple example of using the asResourceRow HOC
// (use import { PlaceholderResourceRow } from './components')
interface PlaceholderResourceRowProps extends ResourceRowProps {
  isPlacholder: boolean;
  // implicitly has data and key by extension
}

interface PlaceholderResourceState {
  dataType?: string;
  isPlacholder: boolean;
}

class PlaceholderResourceRow extends React.Component<PlaceholderResourceRowProps, PlaceholderResourceState> {
  constructor(props: PlaceholderResourceRowProps) {
    super(props);
    this.state = {
      isPlacholder: true,
      dataType: (props.data !== null && typeof props.data === 'object' && typeof props.data.dataType === 'string') ?
        props.data.dataType : undefined,
    };
  }
  render() {
    let dataDescription = this.props.data ? this.props.data.toString() : 'undefined';
    return (
      <div className="ResourceRow">
        Placeholder Resource Row <br/>
        {this.props.key}:{dataDescription}
      </div>
    );
  }
}

export default asResourceRow(PlaceholderResourceRow);
