import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, Send, Calendar, Clock, CheckCircle2, X, MapPin } from 'lucide-react';
import { business, fullAddress, mailtoLink, whatsappLink } from '../config/business';
import { canSendEnquiry, hasBackend, postJSON, sendEnquiry } from '../lib/api';
import { CONSULT_SLOTS, isSlotOpen, slotDateTimeString, upcomingBusinessDays } from '../lib/schedule';

const SERVICE_OPTIONS = [
  'Business website',
  'Web application',
  'Mobile app',
  'Database design',
  'Laptop / computer repair or software',
  'Learning support / tutoring',
  'Something else',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const openInNewTab = (url) => {
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  return Boolean(win);
};

export default function Contact({ activeQuote, clearActiveQuote }) {
  // Shared contact details (used by both the inquiry and the call request).
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bizName, setBizName] = useState('');
  const [service, setService] = useState(activeQuote ? activeQuote.type : '');
  const [details, setDetails] = useState('');
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState(''); // honeypot: real people never fill this

  // idle | sending | sent | handoff | failed
  const [inquiryStatus, setInquiryStatus] = useState('idle');
  const [inquiryError, setInquiryError] = useState('');
  const [handoffChannel, setHandoffChannel] = useState('whatsapp');

  // Call request
  const days = useMemo(() => upcomingBusinessDays(5), []);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [callStatus, setCallStatus] = useState('idle'); // idle | sending | booked | handoff | failed
  const [callError, setCallError] = useState('');
  const [meetLink, setMeetLink] = useState('');

  const selectedDay = days.find((d) => d.iso === day);

  const inquiryText = () => {
    const facts = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      phone.trim() && `Phone: ${phone.trim()}`,
      bizName.trim() && `Business: ${bizName.trim()}`,
      service && `Service: ${service}`,
      activeQuote && `Calculator estimate: ${activeQuote.pages} — ${activeQuote.price} (${activeQuote.timeline})`,
    ].filter(Boolean);
    return ['Hi SaxsProjects, I would like a quote.', '', ...facts, '', details.trim()].join('\n');
  };

  const callText = () =>
    [
      'Hi SaxsProjects, I would like to book a free 15-minute consultation.',
      '',
      `Preferred time: ${selectedDay ? selectedDay.long : ''} at ${time} (SAST)`,
      `Name: ${name.trim()}`,
      email.trim() && `Email: ${email.trim()}`,
      phone.trim() && `Phone: ${phone.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');

  const validateInquiry = () => {
    if (!name.trim()) return 'Please enter your name.';
    if (!EMAIL_RE.test(email.trim())) return 'Please enter a valid email address so we can reply.';
    if (!details.trim()) return 'Please tell us a little about what you need.';
    if (!consent) return 'Please tick the box to let us use your details to reply.';
    return '';
  };

  const handOff = (channel, text, subject) => {
    setHandoffChannel(channel);
    if (channel === 'email') {
      window.location.href = mailtoLink(subject, text);
    } else {
      openInNewTab(whatsappLink(text));
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    const problem = validateInquiry();
    if (problem) {
      setInquiryError(problem);
      return;
    }
    setInquiryError('');

    if (trap) {
      setInquiryStatus('sent');
      return;
    }

    const channel = e.nativeEvent?.submitter?.value || 'whatsapp';

    if (!canSendEnquiry) {
      handOff(channel, inquiryText(), `Quote request from ${name.trim()}`);
      setInquiryStatus('handoff');
      return;
    }

    setInquiryStatus('sending');
    try {
      await sendEnquiry({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        phone: phone.trim(),
        bizName: bizName.trim(),
        service,
        details: details.trim(),
        activeQuote: activeQuote || null,
        consent: true,
        website: trap,
      });
      setInquiryStatus('sent');
    } catch (err) {
      console.error('Inquiry submission failed:', err);
      setInquiryStatus('failed');
    }
  };

  const handleCallRequest = async (channel) => {
    if (!day || !time) {
      setCallError('Please choose a day and a time.');
      return;
    }
    if (!name.trim()) {
      setCallError('Please enter your name.');
      return;
    }
    if (hasBackend && channel === 'backend' && !EMAIL_RE.test(email.trim())) {
      setCallError('Please enter a valid email address for the calendar invite.');
      return;
    }
    if (!isSlotOpen(day, time)) {
      setCallError('That time has just passed. Please pick a later slot.');
      return;
    }
    setCallError('');

    if (channel !== 'backend') {
      handOff(channel, callText(), `Consultation request from ${name.trim()}`);
      setCallStatus('handoff');
      return;
    }

    setCallStatus('sending');
    try {
      const data = await postJSON('/schedule', {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        phone: phone.trim(),
        dateTimeString: slotDateTimeString(day, time),
      });
      setMeetLink(data && typeof data.meetLink === 'string' && data.meetLink.startsWith('https://meet.google.com/') ? data.meetLink : '');
      setCallStatus('booked');
    } catch (err) {
      console.error('Consultation booking failed:', err);
      setCallStatus('failed');
    }
  };

  const resetInquiry = () => {
    setInquiryStatus('idle');
    setDetails('');
  };

  return (
    <div className="contact-container fade-in container section-padding">
      <div className="section-header">
        <span className="section-subtitle">Get In Touch</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Get a free quote</h1>
        <p>
          Tell us what you need and we&apos;ll come back with a fixed quote and timeline. {business.contact.responseTime} Prefer to
          talk? Call, WhatsApp, or request a free 15-minute call below.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Direct channels */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Talk to us directly</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <li style={{ display: 'flex', gap: '0.75rem' }}>
              <Phone size={18} style={{ color: 'var(--primary-glow)', marginTop: '0.2rem', flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Call</p>
                {business.contact.phones.map((p) => (
                  <p key={p.e164} style={{ fontSize: '0.92rem' }}>
                    <a href={`tel:${p.e164}`} style={{ color: 'var(--primary-neon)', fontWeight: 700 }}>{p.display}</a>{' '}
                    <span className="muted" style={{ fontSize: '0.78rem' }}>({p.label})</span>
                  </p>
                ))}
              </div>
            </li>
            <li>
              <a href={whatsappLink("Hi SaxsProjects! I'd like to ask about your services.")} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '0.75rem' }}>
                <MessageCircle size={18} style={{ color: '#128C7E', marginTop: '0.2rem', flexShrink: 0 }} aria-hidden="true" />
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>WhatsApp</p>
                  <p style={{ fontSize: '0.92rem', color: 'var(--primary-neon)', fontWeight: 700 }}>{business.contact.whatsappDisplay}</p>
                  <p className="muted" style={{ fontSize: '0.78rem' }}>Messages go straight to the developer</p>
                </div>
              </a>
            </li>
            <li>
              <a href={`mailto:${business.contact.email}`} style={{ display: 'flex', gap: '0.75rem' }}>
                <Mail size={18} style={{ color: 'var(--primary-glow)', marginTop: '0.2rem', flexShrink: 0 }} aria-hidden="true" />
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Email</p>
                  <p style={{ fontSize: '0.92rem', color: 'var(--primary-neon)', fontWeight: 700, wordBreak: 'break-all' }}>{business.contact.email}</p>
                </div>
              </a>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem' }}>
              <Clock size={18} style={{ color: 'var(--primary-glow)', marginTop: '0.2rem', flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Hours</p>
                <p style={{ fontSize: '0.92rem' }}>{business.hours.display}</p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '0.75rem' }}>
              <MapPin size={18} style={{ color: 'var(--primary-glow)', marginTop: '0.2rem', flexShrink: 0 }} aria-hidden="true" />
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Based in</p>
                <p style={{ fontSize: '0.92rem' }}>{fullAddress()} — working with clients across South Africa remotely.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Inquiry form */}
        <div className="glass-card" style={{ border: activeQuote ? '1px solid var(--primary-glow)' : undefined }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Send us your project details</h2>

          {inquiryStatus === 'sent' && (
            <div className="form-success fade-in" role="status">
              <CheckCircle2 size={28} style={{ color: '#16A34A', marginBottom: '0.5rem' }} aria-hidden="true" />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Thank you, {name.trim().split(' ')[0] || 'we got it'}!</h3>
              <p style={{ fontSize: '0.92rem', marginBottom: '1rem' }}>
                Your enquiry has been received. {business.contact.responseTime} A copy has been sent to {email.trim()}.
              </p>
              <button type="button" className="neon-outline-btn" onClick={resetInquiry}>Send another enquiry</button>
            </div>
          )}

          {inquiryStatus === 'handoff' && (
            <div className="form-success fade-in" role="status">
              <CheckCircle2 size={28} style={{ color: '#16A34A', marginBottom: '0.5rem' }} aria-hidden="true" />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Almost done — press send in {handoffChannel === 'email' ? 'your email app' : 'WhatsApp'}
              </h3>
              <p style={{ fontSize: '0.92rem', marginBottom: '1rem' }}>
                We&apos;ve written the message for you. Once you send it, we&apos;ll reply with your quote. {business.contact.responseTime}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a className="neon-glow-btn" href={whatsappLink(inquiryText())} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} aria-hidden="true" /> Open WhatsApp
                </a>
                <a className="neon-outline-btn" href={mailtoLink(`Quote request from ${name.trim()}`, inquiryText())}>
                  <Mail size={16} aria-hidden="true" /> Use email instead
                </a>
              </div>
              <button type="button" onClick={() => setInquiryStatus('idle')} style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--primary-neon)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}>
                Edit my details
              </button>
            </div>
          )}

          {(inquiryStatus === 'idle' || inquiryStatus === 'sending' || inquiryStatus === 'failed') && (
            <form onSubmit={handleInquirySubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeQuote && (
                <div className="fade-in" style={{ padding: '0.9rem 1rem', border: '1px solid rgba(0, 102, 255, 0.25)', background: 'rgba(0, 102, 255, 0.04)', borderRadius: '8px', position: 'relative' }}>
                  <button onClick={clearActiveQuote} type="button" aria-label="Remove calculator estimate" style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                  <p style={{ fontSize: '0.72rem', color: 'var(--primary-glow)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your calculator estimate</p>
                  <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>{activeQuote.pages}</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    {activeQuote.price} · about {activeQuote.timeline} · {`R${activeQuote.deposit.toLocaleString('en-US')}`} deposit to start
                  </p>
                </div>
              )}

              <div className="form-grid">
                <label className="field">
                  <span className="field-label">Your name</span>
                  <input className="field-input" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label className="field">
                  <span className="field-label">Email</span>
                  <input className="field-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label className="field">
                  <span className="field-label">Phone / WhatsApp <span className="optional">(optional)</span></span>
                  <input className="field-input" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </label>
                <label className="field">
                  <span className="field-label">Business name <span className="optional">(optional)</span></span>
                  <input className="field-input" type="text" autoComplete="organization" value={bizName} onChange={(e) => setBizName(e.target.value)} />
                </label>
              </div>

              <label className="field">
                <span className="field-label">What do you need?</span>
                <select className="field-input" value={service} onChange={(e) => setService(e.target.value)}>
                  <option value="">Choose a service…</option>
                  {[...new Set([...(activeQuote ? [activeQuote.type] : []), ...SERVICE_OPTIONS])].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="field-label">Project details</span>
                <textarea
                  className="field-input"
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="What should it do, who is it for, and when do you need it?"
                  required
                />
              </label>

              <label className="hp-field" aria-hidden="true">
                Leave this empty
                <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
              </label>

              <label className="form-consent">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>
                  I agree that {business.tradingName} may use these details to respond to my enquiry, as explained in the{' '}
                  <Link to="/privacy">Privacy Policy</Link>.
                </span>
              </label>

              {inquiryError && <p className="form-error" role="alert">{inquiryError}</p>}

              {inquiryStatus === 'failed' && (
                <div className="form-error" role="alert">
                  <p style={{ color: 'inherit', marginBottom: '0.6rem' }}>
                    Sorry — our form couldn&apos;t send just now. Your details are still here; please send them another way:
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <a className="neon-glow-btn" style={{ padding: '0.55rem 1rem' }} href={whatsappLink(inquiryText())} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                    <a className="neon-outline-btn" style={{ padding: '0.55rem 1rem' }} href={mailtoLink(`Quote request from ${name.trim()}`, inquiryText())}>Email</a>
                  </div>
                </div>
              )}

              {canSendEnquiry ? (
                <button type="submit" className="neon-glow-btn" disabled={inquiryStatus === 'sending'} style={{ justifyContent: 'center' }}>
                  {inquiryStatus === 'sending' ? 'Sending…' : 'Send enquiry'} <Send size={14} aria-hidden="true" />
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button type="submit" value="whatsapp" className="neon-glow-btn" style={{ flex: '1 1 200px', justifyContent: 'center' }}>
                    <MessageCircle size={16} aria-hidden="true" /> Send via WhatsApp
                  </button>
                  <button type="submit" value="email" className="neon-outline-btn" style={{ flex: '1 1 200px', justifyContent: 'center' }}>
                    <Mail size={16} aria-hidden="true" /> Send via email
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Call request */}
      <section className="glass-card" style={{ marginTop: '2rem' }} aria-labelledby="call-heading">
        <h2 id="call-heading" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} style={{ color: 'var(--primary-glow)' }} aria-hidden="true" /> Request a free 15-minute call
        </h2>
        <p style={{ fontSize: '0.92rem', marginBottom: '1.5rem' }}>
          Pick a time that suits you (South African time). We&apos;ll confirm and send a Google Meet link — or we can simply phone you.
        </p>

        {callStatus === 'booked' && (
          <div className="form-success fade-in" role="status">
            <CheckCircle2 size={28} style={{ color: '#16A34A', marginBottom: '0.5rem' }} aria-hidden="true" />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your call is booked for {selectedDay?.long} at {time} (SAST)</h3>
            <p style={{ fontSize: '0.92rem' }}>A confirmation has been emailed to {email.trim()}.</p>
            {meetLink && (
              <p style={{ fontSize: '0.92rem', marginTop: '0.5rem' }}>
                Meeting link: <a href={meetLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-neon)', fontWeight: 700 }}>{meetLink}</a>
              </p>
            )}
          </div>
        )}

        {callStatus === 'handoff' && (
          <div className="form-success fade-in" role="status">
            <CheckCircle2 size={28} style={{ color: '#16A34A', marginBottom: '0.5rem' }} aria-hidden="true" />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Press send in {handoffChannel === 'email' ? 'your email app' : 'WhatsApp'} to request {selectedDay?.long} at {time}
            </h3>
            <p style={{ fontSize: '0.92rem', marginBottom: '1rem' }}>We&apos;ll confirm the time and send you the meeting details.</p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a className="neon-glow-btn" href={whatsappLink(callText())} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>
              <a className="neon-outline-btn" href={mailtoLink(`Consultation request from ${name.trim()}`, callText())}>Use email instead</a>
            </div>
            <button type="button" onClick={() => setCallStatus('idle')} style={{ marginTop: '1rem', background: 'none', border: 'none', color: 'var(--primary-neon)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}>
              Choose a different time
            </button>
          </div>
        )}

        {(callStatus === 'idle' || callStatus === 'sending' || callStatus === 'failed') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            <div>
              <p className="field-label" style={{ marginBottom: '0.6rem' }}>1. Choose a day</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {days.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => { setDay(d.iso); setTime(null); }}
                    aria-pressed={day === d.iso}
                    style={{
                      background: day === d.iso ? 'rgba(0, 102, 255, 0.1)' : 'var(--bg-deep)',
                      border: day === d.iso ? '1.5px solid var(--primary-glow)' : '1px solid var(--border-color)',
                      color: day === d.iso ? 'var(--primary-neon)' : 'var(--text-primary)',
                      padding: '0.55rem 0.25rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span style={{ display: 'block', fontWeight: 800 }}>{d.short}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem' }}>{d.dayMonth}</span>
                  </button>
                ))}
              </div>

              {!day && (
                <>
                  <p className="field-label" style={{ marginBottom: '0.4rem' }}>2. Choose a time (SAST)</p>
                  <p className="muted" style={{ fontSize: '0.85rem' }}>Pick a day first.</p>
                </>
              )}
              {day && (
                <>
                  <p className="field-label" style={{ marginBottom: '0.6rem' }}>2. Choose a time (SAST)</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))', gap: '0.5rem' }}>
                    {CONSULT_SLOTS.map((t) => {
                      const open = isSlotOpen(day, t);
                      const selected = time === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          disabled={!open}
                          onClick={() => setTime(t)}
                          aria-pressed={selected}
                          style={{
                            background: selected ? 'rgba(0, 102, 255, 0.1)' : 'var(--bg-deep)',
                            border: selected ? '1.5px solid var(--primary-glow)' : '1px solid var(--border-color)',
                            color: !open ? 'var(--text-muted)' : selected ? 'var(--primary-neon)' : 'var(--text-primary)',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            cursor: open ? 'pointer' : 'not-allowed',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            opacity: open ? 1 : 0.45,
                            textDecoration: open ? 'none' : 'line-through',
                          }}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p className="field-label">3. Your details</p>
              <label className="field">
                <span className="field-label">Name</span>
                <input className="field-input" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">Email {hasBackend ? '' : <span className="optional">(optional)</span>}</span>
                <input className="field-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">Phone <span className="optional">(optional, if you&apos;d rather we call)</span></span>
                <input className="field-input" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>

              {callError && <p className="form-error" role="alert">{callError}</p>}
              {callStatus === 'failed' && (
                <p className="form-error" role="alert">
                  We couldn&apos;t book that automatically. Please send the request by WhatsApp or email below and we&apos;ll confirm it for you.
                </p>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {hasBackend && callStatus !== 'failed' ? (
                  <button type="button" className="neon-glow-btn" disabled={callStatus === 'sending'} onClick={() => handleCallRequest('backend')} style={{ flex: '1 1 200px', justifyContent: 'center' }}>
                    {callStatus === 'sending' ? 'Booking…' : 'Book this call'} <Clock size={14} aria-hidden="true" />
                  </button>
                ) : (
                  <>
                    <button type="button" className="neon-glow-btn" onClick={() => handleCallRequest('whatsapp')} style={{ flex: '1 1 200px', justifyContent: 'center' }}>
                      <MessageCircle size={16} aria-hidden="true" /> Request via WhatsApp
                    </button>
                    <button type="button" className="neon-outline-btn" onClick={() => handleCallRequest('email')} style={{ flex: '1 1 200px', justifyContent: 'center' }}>
                      <Mail size={16} aria-hidden="true" /> Request via email
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
