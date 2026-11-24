// Outgoing email (SMTP). Works with Zoho Mail, Gmail or any SMTP provider.
//
// Zoho Mail settings (see backend/.env.example):
//   SMTP_HOST  smtppro.zoho.com   for an address on your own domain (Zoho Workplace / Mail Lite)
//              smtp.zoho.com      for a free @zoho.com address
//              Accounts in other Zoho regions use that region's host, e.g. smtppro.zoho.eu
//   SMTP_PORT  465 (SSL)          587 (STARTTLS) also works
//   SMTP_USER  the full Zoho mailbox address, e.g. hello@saxsprojects.co.za
//   SMTP_PASS  a Zoho *application-specific password* (required when 2FA is on)
//
// Zoho only accepts mail whose From address is the mailbox you log in with (or
// one of its verified aliases), so From defaults to SMTP_USER.

import nodemailer from 'nodemailer';

export const smtpConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter = null;

export function getTransport() {
  if (!smtpConfigured()) return null;
  if (!transporter) {
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // SSL on 465; STARTTLS on 587
      requireTLS: port !== 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
    });
  }
  return transporter;
}

// "SaxsProjects <hello@saxsprojects.co.za>"
export function fromAddress() {
  const address = process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!address) return undefined;
  if (address.includes('<')) return address;
  const name = (process.env.SMTP_FROM_NAME || 'SaxsProjects').replace(/["\r\n]/g, '');
  return `"${name}" <${address}>`;
}

export async function sendMail(message) {
  const transport = getTransport();
  if (!transport) throw new Error('SMTP is not configured');
  return transport.sendMail({ from: fromAddress(), ...message });
}

export async function verifyMailer() {
  const transport = getTransport();
  if (!transport) throw new Error('SMTP is not configured (set SMTP_HOST, SMTP_USER and SMTP_PASS)');
  await transport.verify();
}
