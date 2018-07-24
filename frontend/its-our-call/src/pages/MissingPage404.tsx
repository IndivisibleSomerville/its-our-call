import * as React from 'react';

import './Page.css';
import './MissingPage404.css';

interface MissingPage404Props { }

const MissingPage404: React.SFC<MissingPage404Props> = () => (
  <div className="Page MissingPage404">
    <div className="full-height scrollable">
      <div className="content">
        <h1>404</h1>
        <p>Sorry! The page you're looking for cannot be found.</p>
      </div>
    </div>
  </div>
);

export default MissingPage404;
