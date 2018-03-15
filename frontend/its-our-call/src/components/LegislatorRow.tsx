import * as React from 'react';
import { asResourceRow, ResourceRowProps } from './ResourceRow';

interface LegislatorRowProps extends ResourceRowProps { }

interface LegislatorRowState {

}

class LegislatorRow extends React.Component<LegislatorRowProps, LegislatorRowState> {
  render() {
    return (
      <div className="LegislatorRow">
        Jack Sparrow <br/>
        US Senator, Vermont
      </div>
    );
  }
}

export default asResourceRow(LegislatorRow);
