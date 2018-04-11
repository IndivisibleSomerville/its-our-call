import * as React from 'react';
import './ImageBadge.css';

import { FaUser } from 'react-icons/lib/fa/';

interface ImageBadgeProps {
  /** Supported values: 'dem', 'repub', undefined */
  type?: string;
  imageUrl?: string;
}

interface ImageBadgeState {
  colorClass: string;
  imageUrlLoaded: boolean;
}

class ImageBadge extends React.Component<ImageBadgeProps, ImageBadgeState> {
  constructor(props: ImageBadgeProps) {
    super(props);
    let colorClass = 'undefined';
    if (props.type !== undefined) {
      colorClass = props.type === 'dem' ? 'blue' : (this.props.type === 'repub' ? 'red' : 'error');
    }
    this.state = {
      colorClass,
      imageUrlLoaded: false,
    };
  }

  render() {
    return (
      <div className={'ImageBadge ' + this.state.colorClass}>
        <FaUser />
      </div>
    );
  }
}

export default ImageBadge;
