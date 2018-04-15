import * as React from 'react';
import './BookmarkStar.css';

import * as uuid from 'uuid';

// import { MdDone } from 'react-icons/lib/md/';
// import { FaCheck } from 'react-icons/lib/fa/';
import { IoCheckmark } from 'react-icons/lib/io/';
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
  isLoadedSuggestions?: boolean;
  suggestions: BookmarkSuggestionProps[];
  uniqueClickableAreaID: string;
}

interface BookmarkSuggestionProps {
  startsBookmarked: boolean;
  uniqueContainerID: string;
  title: string;
}

interface BookmarkSuggestionState {
  isSubBookmarked: boolean;
  uniqueClickableAreaID: string;
}

class BookmarkSuggestion extends React.Component<BookmarkSuggestionProps, BookmarkSuggestionState> {
  constructor(props: BookmarkSuggestionProps) {
    super(props);
    this.state = {
      isSubBookmarked: this.props.startsBookmarked === true,
      uniqueClickableAreaID: `${props.uniqueContainerID}_clickableArea_${ uuid.v1() }`,
    };
    this.toggleSubBookmark = this.toggleSubBookmark.bind(this);
  }

  toggleSubBookmark() {
    this.setState({isSubBookmarked: !this.state.isSubBookmarked});
    // TODO: prompt other ui callbacks
  }

  render() {
    let starIcon = (<IoIosStarOutline />);
    let bookmarkClass = 'unchecked';
    if (this.state.isSubBookmarked) {
      starIcon = (<IoIosStar />);
      bookmarkClass = 'checked';
    }
    return (
      <div className="suggestion">
        <div className={'embedded-bookmark-star ' + bookmarkClass}>
          {starIcon}
          <div
            id={this.state.uniqueClickableAreaID}
            className="clickable-area"
            onClick={this.toggleSubBookmark}
          >
              &nbsp;
          </div>
        </div>
        <div className="title">{this.props.title}</div>
      </div>
    );
  }
}

class BookmarkStar extends React.Component<BookmarkStarProps, BookmarkStarState> {
  constructor(props: BookmarkStarProps) {
    super(props);
    this.state = {
      uniqueClickableAreaID: `clickableArea_${ uuid.v1() }`,
      isBookmarked: this.props.isBookmarked === true,
      isShowingPopover: false,
      isLoadedSuggestions: true,
      suggestions: [
        {startsBookmarked: false, title: 'Example one (Senator, VT)', uniqueContainerID: ''},
        {startsBookmarked: false, title: 'Example two (Representative 9th District, VT)', uniqueContainerID: ''}
      ],
    };
    this.toggleBookmark = this.toggleBookmark.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
  }
  toggleBookmark() {
    this.setState({isBookmarked: !this.state.isBookmarked});
    this.setState({isShowingPopover: !this.state.isShowingPopover});
    // TODO: prompt other ui callbacks
  }

  onClickOutside(e: MouseEvent) {
    let targetIsInsidePopoverContainer = (t: Element | null): boolean => {
      // all legal clickable areas need ids beginning with the same unique clickable string
      return (t instanceof Element && (t.id).startsWith(this.state.uniqueClickableAreaID));
    };
    if (e.currentTarget instanceof Element) {
      if (e.currentTarget.id === this.state.uniqueClickableAreaID) {
        // ignore ourselves so that the popover does not immediately dismiss
        return;
      }
      if (targetIsInsidePopoverContainer(e.currentTarget)) {
        return;
      }
    }
    this.setState({isShowingPopover: false});
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

    let additionalContent = (<div className="content">loading</div>);
    if (this.state.isLoadedSuggestions && this.state.suggestions.length > 0) {
      additionalContent = (
        <div className="content">
          <div className="top">bookmark more</div>
          {this.state.suggestions.map((s: BookmarkSuggestionProps, indx: number) => {
              return (
                <BookmarkSuggestion
                  key={indx}
                  uniqueContainerID={this.state.uniqueClickableAreaID}
                  title={s.title}
                  startsBookmarked={s.startsBookmarked}
                />
              ); })}
        </div>
      );
    }

    return (
      <ReactPopover
          isOpen={this.state.isShowingPopover}
          position={['bottom']} // preferred position
          containerClassName="BookmarkPopoverContainer"
          onClickOutside={this.onClickOutside}
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
                  <IoCheckmark/> <div className="text">bookmarked</div>
                </div>
                {additionalContent}
              </div>
            </ArrowContainer>)}
      >
        <div
          className={'BookmarkStar ' + bookmarkClass}
        >
          {starIcon}
          <div
            id={this.state.uniqueClickableAreaID}
            className="clickable-area"
            onClick={this.toggleBookmark}
          >
              &nbsp;
          </div>
        </div>

      </ReactPopover>
    );
  }
}

export default BookmarkStar;
