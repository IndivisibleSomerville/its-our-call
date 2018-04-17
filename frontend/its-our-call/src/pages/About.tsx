import * as React from 'react';

import './Page.css';
import './About.css';

import { Footer } from '../components';

interface AboutProps { }

interface AboutState { }

class About extends React.Component<AboutProps, AboutState> {
  constructor(props: AboutProps) {
    super(props);
    // TODO: set initial load issues to false & dispatch async load calls to endpoints
  }

  // tslint:disable:max-line-length
  render() {
    return (
      <div className="Page About">
        <div className="full-height scrollable">
          <div className="content">
            <h1>About</h1>
            <h2>Nulla Felis Mauris</h2>
            <p>Eu ius ceteros necessitatibus conclusionemque, commodo debitis mnesarchum cum in. Ei bonorum laoreet maiorum qui.</p>
            <ul>
              <li>update email</li>
              <li>feedback request</li>
              <li>positions aren't necessarily Indivisile's positions</li>
              <li>issues &amp; summaries</li>
            </ul>
            <h2>Nulla Felis Mauris</h2>
            <p>Quis vivendo mentitum est et, maiestatis reprimique quo et, fugit utamur cu eos. Dico facete albucius pri eu. Ei scribentur definitiones usu. Essent aperiri sit ut. Id vix autem libris.</p>
            <h3>Subhead</h3>
            <p>Ius te atqui inermis consulatu. Ea per possim democritum instructior. Eu tractatos periculis sed, mei ne aliquip vituperatoribus, debitis fabellas no quo. At inimicus euripidis vix, mel justo facilis atomorum ad. At quo possim officiis deseruisse, cu erat putant insolens pro, cu quo nonumy dignissim.</p>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default About;
