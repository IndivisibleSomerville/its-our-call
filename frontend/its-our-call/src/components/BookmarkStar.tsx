import * as React from 'react';
import './BookmarkStar.css';

interface BookmarkStarProps {
  isBookmarked?: boolean;
  wasPressed?: string;
}

class BookmarkStar extends React.Component<BookmarkStarProps> {
  render() {
    return (
      <div className="BookmarkStar">
        ⋆
      </div>
    );
  }
}

export default BookmarkStar;
