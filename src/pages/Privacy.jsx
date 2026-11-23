import { Link } from 'react-router-dom';
import { business, fullAddress, legalName } from '../config/business';

export default function Privacy() {
  const reg = business.registration;
  const officer = reg.informationOfficer || business.founder.name;

  return (
    <article className="container section-padding legal fade-in">
      <span className="section-subtitle">Legal</span>
      <h1>Privacy Policy</h1>
      <p className="muted">Last updated: {business.legalLastUpdated}</p>

      <p>
        {legalName()} (&ldquo;{business.tradingName}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what
        personal information we collect, why we collect it, how we protect it and the rights you have under the Protection of
        Personal Information Act, 2013 (POPIA).
      </p>

      <h2>1. Who is responsible for your information</h2>
      <table className="legal-table">
        <tbody>
          <tr><th scope="row">Responsible party</th><td>{legalName()}</td></tr>
          {reg.registrationNumber && <tr><th scope="row">Registration number</th><td>{reg.registrationNumber}</td></tr>}
          <tr><th scope="row">Information Officer</th><td>{officer}</td></tr>
          <tr><th scope="row">Email</th><td><a href={`mailto:${business.contact.email}`}>{business.contact.email}</a></td></tr>
          <tr><th scope="row">Phone</th><td>{business.contact.phones.map((p) => p.display).join(' / ')}</td></tr>
          <tr><th scope="row">Address</th><td>{fullAddress()}</td></tr>
        </tbody>
      </table>

      <h2>2. What we collect</h2>
      <ul>
        <li><strong>Contact details</strong> you give us: name, email address, phone or WhatsApp number and business name.</li>
        <li><strong>Project information</strong>: what you tell us about your project, your quote, files or content you send us.</li>
        <li><strong>Booking details</strong>: the date and time you choose for a consultation.</li>
        <li><strong>Client portal data</strong> (clients only): login email, project milestones, invoices and messages.</li>
        <li><strong>Billing records</strong>: quotes, invoices and payment confirmations.</li>
        <li><strong>Devices you bring for repair</strong>: we may see files on the device while working on it. We only access what we need to fix the problem.</li>
        <li><strong>Technical information</strong>: our hosting provider keeps standard server logs (such as IP address and browser type) for security.</li>
      </ul>
      <p>
        Giving us your details is voluntary, but without contact details we cannot reply to you or provide a service.
      </p>

      <h2>3. Why we use it</h2>
      <ul>
        <li>To reply to your enquiry and prepare a quote.</li>
        <li>To schedule and hold consultations.</li>
        <li>To deliver, support and invoice the services you ask for.</li>
        <li>To meet our legal obligations, such as keeping tax and accounting records.</li>
        <li>To keep our website and systems secure.</li>
      </ul>
      <p>
        We only use your information for these purposes, based on your consent, to perform our agreement with you, or to comply
        with the law. We do not sell your information. We will only send you marketing messages if you have asked for them, and
        you can opt out at any time.
      </p>

      <h2>4. Who we share it with</h2>
      <p>We use a small number of trusted service providers to run the business:</p>
      <ul>
        <li><strong>WhatsApp (Meta)</strong> and <strong>email providers (Google)</strong> — when you message or email us.</li>
        <li><strong>Website hosting (Vercel)</strong> and <strong>Google Fonts</strong> — to deliver this website.</li>
        <li><strong>Database and login providers (MongoDB Atlas, Google Firebase)</strong> — for the client portal and stored enquiries.</li>
        <li><strong>Google Calendar / Meet</strong> — for scheduled video consultations.</li>
      </ul>
      <p>
        Some of these providers store data outside South Africa. We only use providers that are bound by data-protection laws or
        agreements offering protection similar to POPIA. We may also disclose information where the law requires it.
      </p>

      <h2>5. How long we keep it</h2>
      <ul>
        <li>Enquiries that don&apos;t become projects: up to 12 months, then deleted.</li>
        <li>Client and billing records: 5 years after the project ends, as required for tax purposes.</li>
        <li>Data on repaired devices: we do not keep copies of your files once the repair is complete.</li>
      </ul>

      <h2>6. How we protect it</h2>
      <p>
        We use reasonable technical and organisational measures, including encrypted connections (HTTPS), access-controlled
        accounts with strong passwords, and limiting access to people who need it. If we become aware of a security compromise
        affecting your information, we will notify you and the Information Regulator as POPIA requires.
      </p>

      <h2>7. Children</h2>
      <p>
        If you are under 18 and want learning support, a parent or guardian must contact us or give consent on your behalf before
        we collect your information.
      </p>

      <h2>8. Your rights</h2>
      <p>You may at any time:</p>
      <ul>
        <li>ask what personal information we hold about you and request a copy;</li>
        <li>ask us to correct or delete information that is wrong, out of date or no longer needed;</li>
        <li>object to us using your information, or withdraw your consent;</li>
        <li>opt out of any marketing messages.</li>
      </ul>
      <p>
        Email <a href={`mailto:${business.contact.email}`}>{business.contact.email}</a> and we will respond within a reasonable
        time (normally within 30 days). We may ask you to confirm your identity first.
      </p>
      <p>
        If you are unhappy with how we handle your information, please contact us first so we can try to fix it. You also have
        the right to lodge a complaint with the Information Regulator (South Africa) —{' '}
        <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer">inforegulator.org.za</a>.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top shows when it last changed. See also our{' '}
        <Link to="/terms">Terms of Service</Link>.
      </p>
    </article>
  );
}
