import * as React from 'react';
import './BookmarkStar.css';

import { MdDone } from 'react-icons/lib/md/';
import { IoIosStarOutline, IoIosStar } from 'react-icons/lib/io/';
import ReactPopover, { ArrowContainer } from 'react-tiny-popover';

interface BookmarkStarProps {
  isHidden?: boolean;
  isBookmarked?: boolean;
  wasPressed?: string;
}

interface BookmarkStarState {
  isBookmarked: boolean;
  isShowingPopover: boolean;
}

class BookmarkStar extends React.Component<BookmarkStarProps, BookmarkStarState> {
  constructor(props: BookmarkStarProps) {
    super(props);
    this.state = {
      isBookmarked: this.props.isBookmarked === true,
      isShowingPopover: false,
    };
    this.toggleBookmark = this.toggleBookmark.bind(this);
  }
  toggleBookmark() {
    this.setState({isBookmarked: !this.state.isBookmarked, isShowingPopover: !this.state.isBookmarked});
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
      <ReactPopover
          isOpen={this.state.isShowingPopover}
          position={'bottom'} // preferred position
          containerClassName="BookmarkPopoverContainer"
          content={({ position, targetRect, popoverRect }) => (
            <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                position={position}
                targetRect={targetRect}
                popoverRect={popoverRect}
                arrowColor={'#fff'}
                arrowSize={10}
                arrowStyle={{}}
            >
              <div className="inner-content">
                <div className="header">
                  <MdDone/> <div className="text">bookmarked</div>
                </div>
                <div className="content">
                TODO: more content
                </div>
              </div>
            </ArrowContainer>)}
      >
        <div
          className={'BookmarkStar ' + bookmarkClass}
          onClick={this.toggleBookmark}
        >
          {starIcon}
        </div>

      </ReactPopover>
    );
  }
}

export default BookmarkStar;
