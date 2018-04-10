import * as React from 'react';

interface SearchOverlayProps {
  hidden: boolean;
}

interface SearchOverlayState { }

class SearchOverlay extends React.Component<SearchOverlayProps, SearchOverlayState> {
  render() {
    return  (
      // TODO make this actually an overlay
      <div className="search" hidden={this.props.hidden}>
      [Search overlay]
      </div>
    );
  }
}

export default SearchOverlay;
