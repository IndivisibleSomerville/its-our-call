import * as React from 'react';
import './Footer.css';

interface FooterProps { }

interface FooterState { }

class Footer extends React.Component<FooterProps, FooterState> {
  render() {
    return (
    <div className="Footer">
      <div className="buttons">
        <a href="https://indivisiblesomerville.org/donate/" className="btn donate">donate</a>
        <a href="https://indivisiblesom.typeform.com/to/sMzNr6" className="btn feedback">feedback</a>
      </div>
      <div className="description">
        An erat regione fierent mel. Perpetua forensibus pro ei. Sit cu affert volutpat, vix at rebum aperiam delectus.
        Eam ad modo dolorem accommodare, ius ei sale congue nonumes. Vix homero facilis at.
        Saepe aeterno pertinacia vix ut, vix meis definiebas in.
        Powered by <a href="5calls.org">5calls.org</a>
      </div>
      <div className="copyright">
        copyright
      </div>
      <div className="photo-credit">
        <strong>photo credit: </strong><a href="#">First Lastname</a>
      </div>
      <a className="parent-org-link" href="https://indivisiblesomerville.org/">
        <div className="logo-text"><strong>Indivisible</strong> Somerville</div>
      </a>
    </div>);
  }
}

export default Footer;
