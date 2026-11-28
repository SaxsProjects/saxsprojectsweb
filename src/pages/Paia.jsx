import { Link } from 'react-router-dom';
import { business, fullAddress, legalName } from '../config/business';

const MANUAL = '/docs/SaxsProjects_PAIA_and_POPIA_Manual.pdf';

export default function Paia() {
  const reg = business.registration;
  const officer = reg.informationOfficer || business.founder.name;

  return (
    <article className="container section-padding legal fade-in">
      <span className="section-subtitle">Legal</span>
      <h1>PAIA and POPIA Manual</h1>
      <p className="muted">Section 51 of the Promotion of Access to Information Act 2 of 2000 · Ref SP/CORP/2026/003 · Version 1.0, 28 November 2026</p>

      <p>
        This manual explains which records {legalName()} holds, how to ask for access to them, what it costs, and how we
        process personal information under the Protection of Personal Information Act, 2013 (POPIA). It is free to read and
        download.
      </p>

      <p>
        <a className="neon-glow-btn" href={MANUAL} target="_blank" rel="noopener noreferrer">
          Read the manual (PDF)
        </a>
      </p>

      <h2>Information Officer</h2>
      <table className="legal-table">
        <tbody>
          <tr><th scope="row">Company</th><td>{legalName()}</td></tr>
          {reg.registrationNumber && <tr><th scope="row">Registration number</th><td>{reg.registrationNumber}</td></tr>}
          <tr><th scope="row">Information Officer</th><td>{officer}</td></tr>
          <tr><th scope="row">Email</th><td><a href={`mailto:${business.contact.email}`}>{business.contact.email}</a></td></tr>
          <tr><th scope="row">Address</th><td>{fullAddress()}</td></tr>
        </tbody>
      </table>

      <h2>How to ask for a record</h2>
      <p>
        Email the Information Officer at <a href={`mailto:${business.contact.email}`}>{business.contact.email}</a> using the
        request form described in the manual (Form 2 of the PAIA regulations). Requests about your own personal information
        are free. See also our <Link to="/privacy">Privacy Policy</Link>.
      </p>
      <p>
        If you are not satisfied with our answer, you may complain to the Information Regulator:{' '}
        <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer">inforegulator.org.za</a>.
      </p>
    </article>
  );
}
