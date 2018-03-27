import * as React from 'react';
import './BookmarkStar.css';

interface BookmarkStarProps {
  isHidden?: boolean;
  isBookmarked?: boolean;
  wasPressed?: string;
}

class BookmarkStar extends React.Component<BookmarkStarProps> {
  render() {
    if (this.props.isHidden) {
      return null;
    }
    return (
      <div className="BookmarkStar">
        ⋆
      </div>
    );
  }
}

export default BookmarkStar;
