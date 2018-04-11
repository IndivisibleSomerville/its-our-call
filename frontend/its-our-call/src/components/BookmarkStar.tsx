import * as React from 'react';
import './BookmarkStar.css';

import { IoIosStarOutline, IoIosStar } from 'react-icons/lib/io/';

interface BookmarkStarProps {
  isHidden?: boolean;
  isBookmarked?: boolean;
  wasPressed?: string;
}

interface BookmarkStarState {
  isBookmarked: boolean;
}

class BookmarkStar extends React.Component<BookmarkStarProps, BookmarkStarState> {
  constructor(props: BookmarkStarProps) {
    super(props);
    this.state = {
      isBookmarked: this.props.isBookmarked === true,
    };
    this.toggleBookmark = this.toggleBookmark.bind(this);
  }
  toggleBookmark() {
    this.setState({isBookmarked: !this.state.isBookmarked});
    // TODO: prompt other ui callbacks
  }

  render() {
    if (this.props.isHidden) {
      return null;
    }
    let starIcon = (<IoIosStarOutline />);
    let bookmarkClass = 'unchecked';
    if (this.state.isBookmarked) {
      starIcon = (<IoIosStar />);
      bookmarkClass = 'checked';
    }
    return (
      <div
        className={'BookmarkStar ' + bookmarkClass}
        onClick={this.toggleBookmark}
      >
        {starIcon}
      </div>
    );
  }
}

export default BookmarkStar;
