// Check that outgoing email works (e.g. your Zoho Mail settings).
//
//   cd backend
//   npm run check:email                 # sends a test email to ADMIN_EMAIL
//   npm run check:email -- you@example.com
//
// Run it wherever backend/.env (or your host's environment variables) holds
// the SMTP settings.

import dotenv from 'dotenv';
import { fromAddress, sendMail, verifyMailer } from './mailer.js';

dotenv.config();

const to = process.argv[2] || process.env.INQUIRY_RECIPIENT_EMAIL || process.env.ADMIN_EMAIL;

const hints = (err) => {
  const text = `${err.code || ''} ${err.responseCode || ''} ${err.message || ''}`;
  if (/535|auth/i.test(text)) {
    return 'Login refused. For Zoho: use an application-specific password (Zoho Accounts > Security > App Passwords), make sure SMTP_USER is the full mailbox address, and that IMAP/POP/SMTP access is enabled in Zoho Mail settings.';
  }
  if (/553|relay|sender/i.test(text)) {
    return 'Sender refused. Zoho only sends From the mailbox you log in with (or a verified alias). Leave SMTP_FROM empty or set it to that address.';
  }
  if (/ENOTFOUND|EAI_AGAIN/i.test(text)) {
    return 'SMTP host not found. Zoho hosts: smtppro.zoho.com (your own domain), smtp.zoho.com (free @zoho.com), or your region, e.g. smtppro.zoho.eu.';
  }
  if (/ETIMEDOUT|ECONNREFUSED|ECONNRESET|timeout/i.test(text)) {
    return 'Could not reach the SMTP server. Some hosts block outgoing SMTP ports; try SMTP_PORT=587, or check your host allows outbound SMTP.';
  }
  return null;
};

try {
  await verifyMailer();
  console.log(`✅ Logged in to ${process.env.SMTP_HOST}:${process.env.SMTP_PORT || 465} as ${process.env.SMTP_USER}`);

  if (!to) {
    console.log('No recipient given (set ADMIN_EMAIL or pass an address), so no test email was sent.');
    process.exit(0);
  }

  const info = await sendMail({
    to,
    subject: 'SaxsProjects email test',
    text: `This is a test email from the SaxsProjects backend.\n\nFrom: ${fromAddress()}\nSent: ${new Date().toISOString()}\n\nIf you can read this, enquiry and booking emails will be delivered.`,
  });
  console.log(`✅ Test email sent from ${fromAddress()} to ${to} (message id ${info.messageId})`);
} catch (err) {
  console.error(`❌ Email check failed: ${err.message}`);
  const hint = hints(err);
  if (hint) console.error(`   ${hint}`);
  process.exit(1);
}
