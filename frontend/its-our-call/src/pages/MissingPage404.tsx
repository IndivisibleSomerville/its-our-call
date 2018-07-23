import * as React from 'react';

import './Page.css';
import './MissingPage404.css';

import { Footer } from '../components';

interface MissingPage404Props { }

const MissingPage404: React.SFC<MissingPage404Props> = () => (
  <div className="Page MissingPage404">
    <div className="full-height scrollable">
      <div className="content">
        <div className="copy">
          <h1>404</h1>
        </div>
        <Footer />
      </div>
    </div>
  </div>
);

export default MissingPage404;
