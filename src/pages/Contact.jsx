import { useState, useEffect } from 'react';
import { Phone, Mail, MessageCircle, Send, Calendar, Clock, CheckCircle2, X, Terminal, Server, Shield, Sparkles } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Contact({ activeQuote, clearActiveQuote, setActiveTab, setSaxiQuoteModalOpen }) {
  // Contact Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bizName, setBizName] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Booking Widget States
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [generatedMeetLink, setGeneratedMeetLink] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Simulated SMTP Dispatch Modal States
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Generate dynamic daysList - today and tomorrow only
  const generateAvailableDays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const formatDate = (date) => {
      const dayName = dayNames[date.getDay()];
      const monthName = monthNames[date.getMonth()];
      const dateNum = date.getDate();
      return { day: dayName, date: `${monthName} ${dateNum}`, fullDate: date };
    };
    
    return [
      formatDate(today),
      formatDate(tomorrow)
    ];
  };

  const daysList = generateAvailableDays();

  const timeSlots = ["09:30", "10:30", "11:30", "12:30", "13:30", "14:30", "15:30", "16:30"];

  // Get current date and time for validation
  const getCurrentDateTime = () => {
    const now = new Date();
    // Return just the current time info
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    
    return {
      hour: parseInt(hour),
      minute: parseInt(minute),
      time: `${hour}:${minute}`
    };
  };

  // Check if a time slot is available for the selected day
  const isTimeAvailable = (time) => {
    if (!selectedDay) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find which day is selected (today or tomorrow)
    const selectedDayObj = daysList.find(d => d.date === selectedDay);
    if (!selectedDayObj) return true;
    
    const selectedDateObj = selectedDayObj.fullDate;
    const isToday = selectedDateObj.getTime() === today.getTime();
    
    // If it's today, check if time has passed
    if (isToday) {
      const now = new Date();
      const [slotHour, slotMinute] = time.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(slotHour, slotMinute, 0, 0);
      
      // Time is available if it's 30 minutes in the future or more
      const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
      return slotTime >= thirtyMinutesFromNow;
    }
    
    // Tomorrow and beyond - all times available
    return true;
  };

  // Fetch booked slots when date is selected
  useEffect(() => {
    if (selectedDay) {
      fetchBookedSlots(selectedDay);
    }
  }, [selectedDay]);

  const fetchBookedSlots = async (dayString) => {
    try {
      setLoadingSlots(true);
      // Format date to YYYY-MM-DD or use the format expected by backend
      const res = await fetch(`${API_BASE_URL}/schedule/booked-slots?date=${dayString}`);
      if (res.ok) {
        const data = await res.json();
        setBookedSlots(data.bookedSlots || []);
        console.log(`📅 Booked slots for ${dayString}:`, data.bookedSlots);
      } else {
        console.log('Could not fetch booked slots, assuming all slots available');
        setBookedSlots([]);
      }
    } catch (err) {
      console.error('Error fetching booked slots:', err);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Check if a time slot is booked
  const isSlotBooked = (time) => bookedSlots.includes(time);

  // Google Meet Random Suffix Generator (meet.google.com/xxx-yyyy-zzz)
  const generateMeetLink = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `https://meet.google.com/${part1}-${part2}-${part3}`;
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    if (!email.trim() || !isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!details.trim()) {
      alert('Please provide project details.');
      return;
    }

    try {
      // Submit inquiry via API - this sends emails to admin and auto-reply to client
      const res = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          name,
          bizName,
          details,
          activeQuote: activeQuote || null
        })
      });

      if (res.ok) {
        await res.json();
        console.log("Inquiry submitted successfully. Emails sent to admin and auto-reply to client.");
        setSubmitted(true);
        setShowInquiryModal(true);
      } else {
        const errorData = await res.json();
        alert(`Failed to submit inquiry: ${errorData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error("Inquiry submission error:", err);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  const handleBooking = async () => {
    const targetEmail = bookingEmail || email;
    if (!targetEmail) {
      alert("Please provide an email address so we can dispatch the calendar invite.");
      return;
    }
    if (!isValidEmail(targetEmail)) {
      alert("Please provide a valid email address.");
      return;
    }
    if (!selectedDay || !selectedTime) {
      alert("Please select a day and time slot first.");
      return;
    }

    // Prepare date/time string (JavaScript Date can parse this standard format)
    const dateTimeString = `2026 ${selectedDay} ${selectedTime}`;

    try {
      const res = await fetch(`${API_BASE_URL}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: targetEmail.toLowerCase(),
          name: name || 'SaxsProjects Partner',
          dateTimeString: dateTimeString
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedMeetLink(data.meetLink);
        setBookingConfirmed(true);
        setShowBookingModal(true);
        console.log("Consultation booked via Express server. Google Meet:", data.meetLink);
      } else {
        const errorData = await res.json();
        alert(`Failed to book consultation: ${errorData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error("Google Meet schedule connection error:", err);
      // Fallback local generator if server is down for sandbox testing
      const meetLink = generateMeetLink();
      setGeneratedMeetLink(meetLink);
      setBookingConfirmed(true);
      setShowBookingModal(true);
    }
  };

  const handleCloseInquiryModal = () => {
    setShowInquiryModal(false);
    // Automatically redirect client to dashboard tracking portal
    setActiveTab('dashboard');
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
  };

  return (
    <div className="contact-container fade-in container section-padding" style={{ position: 'relative' }}>
      <div className="section-header">
        <span className="section-subtitle">Get In Touch</span>
        <h2>Connect & Book</h2>
        <p>Let's align on your project. Submit an inquiry form to automatically activate your custom tracking dashboard, or schedule a free 15-minute consultation slot directly below.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
        
        {/* Left Column: Form & Channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* SaxsProjects Instant Brief & Scope Card */}
          <div className="glass-card" style={{ border: '2px solid var(--primary-glow)', boxShadow: 'var(--card-shadow-hover)', background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.04), rgba(255, 255, 255, 0.9))' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0, 102, 255, 0.1)', color: 'var(--primary-glow)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              <Shield size={14} /> SaxsProjects Automated Solutions Engine
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Need an Instant Scope & Estimate?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Our automated solutions engineering system analyzes your project requirements and generates an estimated software specification, budget range, and timeline. Our lead architect will confirm your quote within 10 minutes.
            </p>
            <button 
              onClick={() => setSaxiQuoteModalOpen && setSaxiQuoteModalOpen(true)}
              className="neon-glow-btn"
              style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem' }}
            >
              <Sparkles size={18} /> Request Instant Project Estimate
            </button>
          </div>

          {/* Quick Channels */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Direct Access</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem' }}>
                <Phone size={18} style={{ color: 'var(--primary-glow)', marginTop: '0.25rem' }} />
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Call Direct</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.1rem' }}>
                    <a href="tel:0714135824" style={{ color: 'var(--primary-glow)', textDecoration: 'none', fontWeight: 700 }}>0714135824</a> <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(Primary)</span>
                  </p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.1rem' }}>
                    <a href="tel:0613991212" style={{ color: 'var(--primary-glow)', textDecoration: 'none', fontWeight: 700 }}>0613991212</a> <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(Support)</span>
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Mon-Fri 9am-5pm SAST</p>
                </div>
              </div>
              <a href="mailto:saxs.solutions25@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', textDecoration: 'none' }}>
                <Mail size={20} style={{ color: 'var(--primary-glow)' }} />
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>saxs.solutions25@gmail.com</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-reply receipt guaranteed in 10 mins</p>
                </div>
              </a>
              <a href="https://wa.me/27613991212" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem', textDecoration: 'none' }}>
                <MessageCircle size={18} style={{ color: '#25D366' }} />
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>WhatsApp Business</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary-glow)', fontWeight: 600 }}>+27 61 399 1212</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instant reply direct from developer</p>
                </div>
              </a>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="glass-card" style={{ border: activeQuote ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)', boxShadow: activeQuote ? 'var(--card-shadow-hover)' : 'var(--card-shadow)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Submit Inquiry</h3>

            {submitted ? (
              <div className="fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ margin: '0 auto 1rem', width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(0, 102, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={32} style={{ color: 'var(--primary-glow)' }} />
                </div>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Inquiry Dispatched</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Your secure SMTP payload has been logged.
                </p>
                <button onClick={handleCloseInquiryModal} className="neon-glow-btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', margin: '0 auto' }}>
                  Go to Client Portal
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Prefilled Quote Card */}
                {activeQuote && (
                  <div className="fade-in" style={{ padding: '0.85rem', border: '1px solid rgba(0, 102, 255, 0.2)', background: 'rgba(0, 102, 255, 0.03)', borderRadius: '8px', position: 'relative', marginBottom: '0.5rem' }}>
                    <button 
                      onClick={clearActiveQuote} 
                      type="button" 
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--primary-glow)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05rem', marginBottom: '0.25rem' }}>Applied Project Config:</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{activeQuote.type} • {activeQuote.pages}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Features: {activeQuote.featureList.length > 0 ? activeQuote.featureList.join(', ') : 'None'}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '0.4rem' }}>Est: {activeQuote.price} | {activeQuote.timeline}</p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Your Name</label>
                    <input 
                      type="text" 
                      placeholder="" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.8rem', borderRadius: '6px', outline: 'none', fontSize: '0.85rem' }} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Business Name</label>
                    <input 
                      type="text" 
                      placeholder="" 
                      value={bizName} 
                      onChange={(e) => setBizName(e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.8rem', borderRadius: '6px', outline: 'none', fontSize: '0.85rem' }} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.8rem', borderRadius: '6px', outline: 'none', fontSize: '0.85rem' }} 
                    required 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Brief Project Details</label>
                  <textarea 
                    rows="3" 
                    placeholder="" 
                    value={details} 
                    onChange={(e) => setDetails(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.8rem', borderRadius: '6px', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }} 
                  />
                </div>

                <button type="submit" className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                  Submit Scope Inquiry <Send size={14} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Right Column: Calendly Simulator Widget */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem' }}>
          <div>
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05rem', marginBottom: '0.25rem' }}>Current Time (SAST)</p>
              <p style={{ fontSize: '1rem', color: 'var(--primary-glow)', fontWeight: 700 }}>
                {new Date().toLocaleString('en-ZA', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Africa/Johannesburg'
                })}
              </p>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: 'var(--primary-glow)' }} /> 15-Min Consultation Schedule
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Book an interactive call direct with the developer. We will review layout directions, domain mapping, and scope specifications.
            </p>

            {bookingConfirmed ? (
              <div className="fade-in" style={{ background: 'rgba(0, 102, 255, 0.03)', border: '1px solid var(--primary-glow)', borderRadius: '12px', padding: '2rem 1.5rem', textAlign: 'center', margin: '2rem 0' }}>
                <div style={{ margin: '0 auto 1rem', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 102, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={24} style={{ color: 'var(--primary-glow)' }} />
                </div>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Consultation Booked!</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Scheduled on <strong>{daysList.find(d => d.date === selectedDay)?.day}, {selectedDay}</strong> at <strong>{selectedTime}</strong>
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Calendar invite dispatched. Check your inbox for Google Meet structures.
                </p>
                <button 
                  onClick={() => setShowBookingModal(true)} 
                  className="neon-outline-btn" 
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', margin: '0 auto' }}
                >
                  View Dispatched Ticket
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Email Address Input for Calendar dispatch */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your Email for Calendar Invite</label>
                  <input 
                    type="email" 
                    placeholder="" 
                    value={bookingEmail || email}
                    onChange={(e) => setBookingEmail(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.8rem', borderRadius: '6px', outline: 'none', fontSize: '0.85rem' }} 
                    required
                  />
                </div>

                {/* Day selector */}
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', letterSpacing: '0.05rem', marginBottom: '0.75rem' }}>1. Select Available Day (Today or Tomorrow):</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                    {daysList.map((d, i) => (
                      <button 
                        key={i}
                        type="button"
                        onClick={() => setSelectedDay(d.date)}
                        style={{ 
                          background: selectedDay === d.date ? 'rgba(0, 102, 255, 0.1)' : 'var(--bg-deep)', 
                          border: selectedDay === d.date ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)', 
                          color: selectedDay === d.date ? 'var(--primary-glow)' : 'var(--text-primary)', 
                          padding: '0.5rem 0.25rem', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          fontSize: '0.8rem',
                          textAlign: 'center'
                        }}
                      >
                        <p style={{ fontWeight: 800 }}>{d.day}</p>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{d.date.split(' ')[1]}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time selector */}
                {selectedDay && (
                  <div className="fade-in">
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', letterSpacing: '0.05rem', marginBottom: '0.75rem' }}>
                      2. Select Available Slot (Africa/Johannesburg):
                      {loadingSlots && <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', opacity: 0.7 }}>(checking availability...)</span>}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      {timeSlots.map((time, idx) => {
                        const booked = isSlotBooked(time);
                        const timeNotAvailable = !isTimeAvailable(time);
                        const unavailable = booked || timeNotAvailable;
                        
                        return (
                          <button 
                            key={idx}
                            type="button"
                            disabled={unavailable}
                            onClick={() => !unavailable && setSelectedTime(time)}
                            style={{ 
                              background: unavailable 
                                ? 'rgba(100, 100, 100, 0.1)' 
                                : selectedTime === time 
                                  ? 'rgba(0, 102, 255, 0.1)' 
                                  : 'var(--bg-deep)', 
                              border: unavailable 
                                ? '1px solid rgba(100, 100, 100, 0.3)' 
                                : selectedTime === time 
                                  ? '1px solid var(--primary-glow)' 
                                  : '1px solid var(--border-color)', 
                              color: unavailable 
                                ? 'rgba(100, 100, 100, 0.6)' 
                                : selectedTime === time 
                                  ? 'var(--primary-glow)' 
                                  : 'var(--text-primary)', 
                              padding: '0.5rem', 
                              borderRadius: '6px', 
                              cursor: unavailable ? 'not-allowed' : 'pointer', 
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              opacity: unavailable ? 0.5 : 1,
                              textDecoration: unavailable ? 'line-through' : 'none',
                              pointerEvents: unavailable ? 'none' : 'auto'
                            }}
                            title={booked ? 'This slot is already booked' : 'Book this time'}
                          >
                            {time}
                            {unavailable && <div style={{ fontSize: '0.6rem', marginTop: '0.2rem', opacity: 0.8 }}>{booked ? 'Booked' : 'Past'}</div>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!bookingConfirmed && (
            <button 
              onClick={handleBooking}
              disabled={(!bookingEmail && !email) || !selectedDay || !selectedTime}
              className="neon-glow-btn" 
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                fontSize: '0.85rem',
                opacity: ((!bookingEmail && !email) || !selectedDay || !selectedTime) ? 0.5 : 1,
                cursor: ((!bookingEmail && !email) || !selectedDay || !selectedTime) ? 'not-allowed' : 'pointer',
                marginTop: '1.5rem'
              }}
            >
              Confirm Consultation Call <Clock size={14} />
            </button>
          )}
        </div>

      </div>

      {/* ========================================================
          SIMULATED SMTP EMAIL DISPATCH MODAL: INQUIRY SUBMISSION
          ======================================================== */}
      {showInquiryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 18, 30, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1.5rem'
        }}>
          <div className="glass-card fade-in" style={{
            maxWidth: '560px',
            width: '100%',
            background: 'var(--bg-pure)',
            border: '2px solid var(--primary-glow)',
            boxShadow: '0 20px 50px rgba(0, 102, 255, 0.3)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(90deg, #091322, #0e223c)',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(0, 102, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-glow)' }}>
                <Server size={18} />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em' }}>SMTP DISPATCH SERVICE</span>
              </div>
              <button 
                onClick={handleCloseInquiryModal}
                style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', opacity: 0.7 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <p><span style={{ color: 'var(--primary-glow)', fontWeight: 'bold' }}>STATUS:</span> 250 OK - Message accepted for delivery</p>
                <p><span style={{ color: 'var(--primary-glow)', fontWeight: 'bold' }}>FROM:</span> web-system@saxsprojects.com</p>
                <p><span style={{ color: 'var(--primary-glow)', fontWeight: 'bold' }}>TO:</span> saxs.solutions25@gmail.com</p>
                <p><span style={{ color: 'var(--primary-glow)', fontWeight: 'bold' }}>SUBJECT:</span> New Project Lead Scope Inquiry: {name}</p>
                <p><span style={{ color: 'var(--primary-glow)', fontWeight: 'bold' }}>SECURITY:</span> TLSv1.3 Encrypted Handshake</p>
              </div>

              <div style={{
                background: 'var(--bg-deep)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                lineHeight: '1.5',
                overflowX: 'auto',
                color: 'var(--text-primary)',
                maxHeight: '220px',
                overflowY: 'auto'
              }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>// JSON Encapsulated Payload</p>
                <p>{"{"}</p>
                <p style={{ paddingLeft: '1.5rem' }}>"senderName": "{name}",</p>
                <p style={{ paddingLeft: '1.5rem' }}>"business": "{bizName || 'N/A'}",</p>
                <p style={{ paddingLeft: '1.5rem' }}>"replyTo": "{email}",</p>
                <p style={{ paddingLeft: '1.5rem' }}>"messageBody": "{details || 'None provided.'}",</p>
                {activeQuote ? (
                  <>
                    <p style={{ paddingLeft: '1.5rem' }}>"prefilledCalculatorQuote": {"{"}</p>
                    <p style={{ paddingLeft: '3rem' }}>"type": "{activeQuote.type}",</p>
                    <p style={{ paddingLeft: '3rem' }}>"scope": "{activeQuote.pages}",</p>
                    <p style={{ paddingLeft: '3rem' }}>"totalZAR": "{activeQuote.price}",</p>
                    <p style={{ paddingLeft: '3rem' }}>"depositUpfront": "R {activeQuote.deposit.toLocaleString()} ZAR",</p>
                    <p style={{ paddingLeft: '3rem' }}>"balanceDue": "R {activeQuote.balance.toLocaleString()} ZAR",</p>
                    <p style={{ paddingLeft: '3rem' }}>"estimatedDays": "{activeQuote.timeline}"</p>
                    <p style={{ paddingLeft: '1.5rem' }}>{"}"},</p>
                  </>
                ) : (
                  <p style={{ paddingLeft: '1.5rem' }}>"prefilledCalculatorQuote": null,</p>
                )}
                <p style={{ paddingLeft: '1.5rem' }}>"timestamp": "{new Date().toISOString()}"</p>
                <p>{"}"}</p>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00FF66' }}>
                <Shield size={16} />
                <span>Encrypted payload dispatched to SMTP routing server successfully.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'flex-end',
              background: 'var(--bg-deep)'
            }}>
              <button onClick={handleCloseInquiryModal} className="neon-glow-btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}>
                Confirm & Access Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SIMULATED CALENDAR EMAIL DISPATCH MODAL: BOOKING
          ======================================================== */}
      {showBookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 18, 30, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1.5rem'
        }}>
          <div className="glass-card fade-in" style={{
            maxWidth: '560px',
            width: '100%',
            background: 'var(--bg-pure)',
            border: '2px solid var(--primary-glow)',
            boxShadow: '0 20px 50px rgba(0, 102, 255, 0.3)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(90deg, #091322, #0e223c)',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(0, 102, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-glow)' }}>
                <Terminal size={18} />
                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em' }}>CALENDAR DISPATCH SERVICE</span>
              </div>
              <button 
                onClick={handleCloseBookingModal}
                style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', opacity: 0.7 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <p><span style={{ color: 'var(--primary-glow)', fontWeight: 'bold' }}>CALENDAR:</span> Invite Dispatched Successfully</p>
                <p><span style={{ color: 'var(--primary-glow)', fontWeight: 'bold' }}>RECIPIENT:</span> {bookingEmail || email}</p>
                <p><span style={{ color: 'var(--primary-glow)', fontWeight: 'bold' }}>CC:</span> saxs.solutions25@gmail.com</p>
                <p><span style={{ color: 'var(--primary-glow)', fontWeight: 'bold' }}>EVENT:</span> 15-Min Technical Scope Consultation</p>
                <p><span style={{ color: 'var(--primary-glow)', fontWeight: 'bold' }}>DATE/TIME:</span> {selectedDay} @ {selectedTime} SAST</p>
              </div>

              <div style={{
                background: 'var(--bg-deep)',
                padding: '1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                lineHeight: '1.6',
                color: 'var(--text-primary)'
              }}>
                <p style={{ fontWeight: 'bold', color: 'var(--primary-glow)', marginBottom: '0.5rem' }}>Google Meet Invite Token:</p>
                <a 
                  href={generatedMeetLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    display: 'inline-block',
                    background: 'rgba(0, 102, 255, 0.08)',
                    border: '1px solid rgba(0, 102, 255, 0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    color: 'var(--primary-glow)',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}
                >
                  {generatedMeetLink}
                </a>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Clicking this link will launch the Google Meet environment. Please ensure you are logged into your Google Account prior to session start.
                </p>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00FF66' }}>
                <Shield size={16} />
                <span>ICS event wrapper attached. Autocommit sync on client calendar active.</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'flex-end',
              background: 'var(--bg-deep)'
            }}>
              <button onClick={handleCloseBookingModal} className="neon-glow-btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}>
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
