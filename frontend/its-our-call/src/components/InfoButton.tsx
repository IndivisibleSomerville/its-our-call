import * as React from 'react';

import ReactPopover, { ArrowContainer } from 'react-tiny-popover';

import './InfoButton.css';

interface InfoButtonProps {

}

interface InfoButtonState {
  isShowingPopover: boolean;
}

class InfoButton extends React.Component<InfoButtonProps, InfoButtonState> {
  constructor(props: InfoButtonProps) {
    super(props);
    this.state = { isShowingPopover: false };
    this.toggleInfo = this.toggleInfo.bind(this);
  }
  toggleInfo() {
    this.setState({isShowingPopover: !this.state.isShowingPopover});
  }
  render() {
    return (
      <ReactPopover
          isOpen={this.state.isShowingPopover}
          position={'bottom'} // preferred position
          onClickOutside={() => this.setState({ isShowingPopover: false })}
          containerClassName="InfoButtonPopoverContainer"
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
                  Our methodology
                </div>
                <div className="text">
                  A few sentences here and there.
                  Include <em>any kind of HTML</em> <b>here</b> that you want.
                </div>
              </div>
            </ArrowContainer>)}
      >
        <div className="InfoButton" onClick={this.toggleInfo}>﹖</div>
      </ReactPopover>
    );
  }
}

export default InfoButton;
