import * as React from 'react';
import './SearchOverlay.css';

interface SearchOverlayProps {
  open: boolean;
}

interface SearchOverlayState { }

class SearchOverlay extends React.Component<SearchOverlayProps, SearchOverlayState> {
  render() {
    return  (
      // TODO make this actually an overlay
      <div className={'SearchOverlay' + (this.props.open ? ' open' : '')}>
      [Search overlay]
      </div>
    );
  }
}

export default SearchOverlay;
