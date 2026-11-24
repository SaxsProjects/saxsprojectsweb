import { Link } from 'react-router-dom';
import { business, fullAddress, isVatRegistered, legalName, priceNote } from '../config/business';
import { DEPOSIT_RATE } from '../config/pricing';

const pct = (rate) => `${Math.round(rate * 100)}%`;

export default function Terms() {
  const reg = business.registration;
  const deposit = pct(DEPOSIT_RATE);
  const balance = pct(1 - DEPOSIT_RATE);

  return (
    <article className="container section-padding legal fade-in">
      <span className="section-subtitle">Legal</span>
      <h1>Terms of Service</h1>
      <p className="muted">Last updated: {business.legalLastUpdated}</p>

      <p>
        These terms apply when you request a quote from, or buy a service from, {legalName()}. They are written to be clear and
        fair. Nothing in them limits the rights you have under the Consumer Protection Act, 2008 (CPA) or the Electronic
        Communications and Transactions Act, 2002 (ECT Act).
      </p>

      <h2>1. About us</h2>
      <table className="legal-table">
        <tbody>
          <tr><th scope="row">Name</th><td>{legalName()}{reg.legalName && reg.legalName !== business.tradingName ? ` (trading as ${business.tradingName})` : ''}</td></tr>
          {reg.entityType && <tr><th scope="row">Legal status</th><td>{reg.entityType}</td></tr>}
          {reg.registrationNumber && <tr><th scope="row">Registration number</th><td>{reg.registrationNumber}</td></tr>}
          {reg.directors && reg.directors.length > 0 && <tr><th scope="row">Director(s)</th><td>{reg.directors.join(', ')}</td></tr>}
          <tr><th scope="row">VAT</th><td>{isVatRegistered() ? `VAT No. ${reg.vatNumber}` : 'Not VAT-registered'}</td></tr>
          <tr><th scope="row">Physical address</th><td>{fullAddress()}</td></tr>
          <tr><th scope="row">Address for legal notices</th><td>{business.address.street ? fullAddress() : `By email to ${business.contact.email}; postal address on request`}</td></tr>
          <tr><th scope="row">Email</th><td><a href={`mailto:${business.contact.email}`}>{business.contact.email}</a></td></tr>
          <tr><th scope="row">Phone</th><td>{business.contact.phones.map((p) => p.display).join(' / ')}</td></tr>
          <tr><th scope="row">Website</th><td>{business.siteUrl.replace(/^https?:\/\//, '')}</td></tr>
          <tr><th scope="row">Business hours</th><td>{business.hours.display}</td></tr>
        </tbody>
      </table>

      <h2>2. Quotes and prices</h2>
      <ul>
        <li>This website does not list prices. The price for your work is set out in a written quotation.</li>
        <li>Before any work or payment, we send you a written quote with the scope, price and timeline. That quote is what you agree to.</li>
        <li>Quotes are valid for 30 days unless the quote says otherwise.</li>
        <li>{priceNote()}</li>
        <li>Third-party costs such as domain names, hosting, paid plugins, app-store fees and replacement parts are not included unless the quote says so.</li>
      </ul>

      <h2>3. Payment</h2>
      <ul>
        <li>Build projects (websites, web apps, mobile apps): {deposit} deposit before work starts and {balance} before launch or handover of the final files.</li>
        <li>Repairs, software setup and learning support: payable on completion or as stated on your quote, unless agreed otherwise.</li>
        <li>We accept EFT to the business bank account shown on our invoice. We will never ask for your card details by email or WhatsApp.</li>
        <li>To protect you from invoice fraud, please confirm our bank details by phone before your first payment. We will never change bank details by email alone.</li>
        <li>If a payment is overdue we may pause work until it is paid. We keep you informed in writing.</li>
        <li>We email you your quote, invoices and receipts so you always have a full record of the transaction.</li>
      </ul>

      <h2>4. Timelines and your input</h2>
      <p>
        Timelines start once we have received your deposit and the content we need from you (such as text, images and logins).
        If content or feedback arrives late, the delivery date moves by the same amount of time. If we will be late for reasons on
        our side, we will tell you as early as possible and agree a new date with you.
      </p>

      <h2>5. Changes to the scope</h2>
      <p>
        Your quote includes up to two rounds of design changes. New features or changes to an approved scope are welcome — we will
        quote them separately and only start once you approve.
      </p>

      <h2>6. Ownership</h2>
      <ul>
        <li>Once you have paid in full, you own the custom design, code and content we create for you, and we hand over all access and source files.</li>
        <li>Third-party components (open-source libraries, fonts, stock images, hosting platforms) stay under their own licences.</li>
        <li>We may show your project in our portfolio unless you ask us not to.</li>
      </ul>

      <h2>7. Support after launch</h2>
      <p>
        For 30 days after launch we fix bugs in our work and make small text or image changes at no extra cost. New features,
        redesigns, and problems caused by changes made by others are not included, but we are happy to quote for them. Ongoing
        support plans are available.
      </p>

      <h2>8. Cancellations and refunds</h2>
      <ul>
        <li>
          <strong>Cooling-off:</strong> you may cancel within 7 days of accepting a quote, without giving a reason, and get a full
          refund — unless you asked us to start work within those 7 days, in which case you pay only for work already done.
        </li>
        <li><strong>Before work starts:</strong> your deposit is refunded in full.</li>
        <li>
          <strong>After work has started:</strong> we refund your deposit less the value of the work already completed. We will show
          you a written breakdown of that work.
        </li>
        <li><strong>If we can&apos;t deliver:</strong> you get a full refund of anything you paid for work that was not delivered.</li>
        <li>Refunds are paid by EFT within 10 business days of being agreed.</li>
      </ul>

      <h2>9. Computer and laptop repairs</h2>
      <ul>
        <li>Please back up your data before handing in a device. We take care with your data, but cannot be responsible for data loss that was not caused by our negligence.</li>
        <li>We give you a quote after diagnosis and only repair once you approve it.</li>
        <li>New or refurbished parts and our labour carry a 3-month warranty, as provided for in the CPA.</li>
        <li>We only install genuine, properly licensed software.</li>
        <li>If a repaired device is not collected within 90 days of us notifying you that it is ready, we may deal with it as the law allows after giving you written notice.</li>
      </ul>

      <h2>10. Learning support and academic integrity</h2>
      <p>
        Our learning support is tutoring and mentorship. We explain concepts, review your approach and help you build skills. We do
        not complete assessed work on your behalf, and you are responsible for following your institution&apos;s rules on
        academic integrity.
      </p>

      <h2>11. Liability</h2>
      <p>
        We deliver our services with reasonable care and skill. To the extent the law allows, our total liability for any claim
        is limited to the amount you paid us for the service concerned, and we are not liable for indirect losses such as lost
        profits. This does not limit liability for gross negligence or any right you have under the CPA.
      </p>

      <h2>12. Privacy</h2>
      <p>
        We handle your personal information as set out in our <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>13. Complaints and disputes</h2>
      <p>
        If something isn&apos;t right, please tell us first at <a href={`mailto:${business.contact.email}`}>{business.contact.email}</a>.
        We will acknowledge your complaint within 2 business days and aim to resolve it within 10 business days. If we cannot
        resolve it together, you may refer the matter to the Consumer Goods and Services Ombud or the National Consumer
        Commission. These terms are governed by the laws of the Republic of South Africa.
      </p>

      <h2>14. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The version that applies to your project is the one in force on the date you
        accepted your quote.
      </p>
    </article>
  );
}
