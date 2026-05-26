import React, { useState } from 'react';
import { BookOpen, Code, Users, CheckCircle, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';

export default function StudentServices({ setActiveTab }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '', contact: '', service: '', message: '' });

  const services = [
    {
      icon: <BookOpen size={40} />,
      title: "Assignment & Essay Writing Assistance",
      description: "Professional help drafting, editing, and structuring academic work across subjects",
      benefits: [
        "Expert guidance from university tutor",
        "Plagiarism-free original content",
        "Fast turnaround times"
      ],
      price: "From R150 ZAR per page"
    },
    {
      icon: <Code size={40} />,
      title: "Project Development & Coding Help",
      description: "Assistance with coding projects, debugging, and academic software assignments",
      benefits: [
        "Expert debugging and optimization",
        "Code review and best practices",
        "Step-by-step explanations"
      ],
      price: "From R300 ZAR per hour"
    },
    {
      icon: <Users size={40} />,
      title: "Microsoft Office Suite Installation",
      description: "Full installation of Word, Excel, PowerPoint, Outlook, etc. on any device",
      benefits: [
        "Quick and professional setup",
        "All components installed correctly",
        "License activation support"
      ],
      price: "From R250 ZAR"
    },
    {
      icon: <Sparkles size={40} />,
      title: "Microsoft App Activation Support",
      description: "Help activating and configuring Microsoft 365 and related apps",
      benefits: [
        "Smooth activation process",
        "Full feature unlocked",
        "Post-setup support"
      ],
      price: "From R200 ZAR"
    }
  ];

  const subjects = [
    "Mathematics",
    "Computer Science",
    "Business Management",
    "English",
    "Accounting",
    "Information Technology",
    "Engineering",
    "Physics",
    "Chemistry",
    "Economics",
    "History",
    "Psychology"
  ];

  const studentTestimonials = [
    {
      quote: "SaxsProjects helped me understand my coding assignment so much better. The step-by-step explanation was exactly what I needed.",
      author: "Lindy M.",
      field: "Computer Science",
      rating: 5
    },
    {
      quote: "I was struggling with my essay structure, but the guidance here made it clear and organized. Highly recommended!",
      author: "Thembi S.",
      field: "English Literature",
      rating: 5
    },
    {
      quote: "Quick installation of Microsoft Office and everything worked perfectly. Professional service!",
      author: "Kabelo T.",
      field: "Business Admin",
      rating: 5
    }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = `Hi! I'm interested in: ${formData.service}. ${formData.message}`;
    const whatsappLink = `https://wa.me/27613991212?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappLink, '_blank');
    setFormData({ name: '', contact: '', service: '', message: '' });
  };

  return (
    <div className="student-services-container fade-in">
      {/* Hero Section */}
      <section className="hero-section container" style={{ padding: '6rem 0 4rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 102, 255, 0.08) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }}></div>

        <span className="section-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto 1.5rem', background: 'rgba(0, 102, 255, 0.05)', padding: '0.5rem 1.25rem', borderRadius: '50px', border: '1px solid rgba(0, 102, 255, 0.15)' }}>
          <BookOpen size={14} style={{ color: 'var(--primary-glow)' }} />
          STUDENT ACADEMIC & TECH SUPPORT
        </span>

        <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
          Struggling with Assignments or Tech? <span className="gradient-text">We've Got You Covered.</span>
        </h1>

        <p style={{ fontSize: '1.25rem', maxWidth: '750px', margin: '0 auto 2.5rem', color: 'var(--text-secondary)' }}>
          Professional academic assistance and technology support from a university tutor and qualified developer. Fast, confidential, and affordable help for South African students.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://wa.me/27613991212?text=Hi SaxsProjects! I need help with my assignments." target="_blank" rel="noopener noreferrer" className="neon-glow-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={16} /> Chat on WhatsApp
          </a>
          <button onClick={() => setActiveTab('contact')} className="neon-outline-btn">
            Get a Free Quote <ArrowRight size={16} />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="trust-badge-row" style={{ marginTop: '5rem' }}>
          <div className="trust-badge">
            <CheckCircle size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Plagiarism-Free</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>100% Original Work</p>
            </div>
          </div>
          <div className="trust-badge">
            <CheckCircle size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Confidential</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Your Privacy Protected</p>
            </div>
          </div>
          <div className="trust-badge">
            <CheckCircle size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Secure Payments</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Multiple Payment Methods</p>
            </div>
          </div>
          <div className="trust-badge">
            <CheckCircle size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Fast Turnaround</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>24-48 Hour Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Services & Support</span>
            <h2>What We Offer</h2>
            <p>Comprehensive student support covering academic writing, coding projects, and tech installations.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {services.map((s, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '1.5rem', color: 'var(--primary-glow)' }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                  {s.description}
                </p>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Key Benefits</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
                    {s.benefits.map((benefit, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <CheckCircle size={14} style={{ color: 'var(--primary-glow)', flexShrink: 0, marginTop: '0.1rem' }} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-glow)', marginBottom: '1rem' }}>{s.price}</p>
                  <a href="https://wa.me/27613991212?text=I'm interested in your student services" target="_blank" rel="noopener noreferrer" className="neon-glow-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    Get Help Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding container">
        <div className="section-header">
          <span className="section-subtitle">Simple Process</span>
          <h2>How It Works</h2>
          <p>Three simple steps to get the help you need.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 1.5rem' }}>1</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Contact Us</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Reach out via WhatsApp or our contact form with your details and what you need help with.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 1.5rem' }}>2</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Describe Your Need</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Share your assignment, coding challenge, or tech problem. We'll discuss scope and timeline.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 1.5rem' }}>3</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Get Fast Support</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Receive professional assistance with quick turnaround. We're here to help you succeed.</p>
          </div>
        </div>
      </section>

      {/* Subjects Covered */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Expertise</span>
            <h2>Subjects & Fields We Cover</h2>
            <p>Expert support across a wide range of academic disciplines.</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {subjects.map((subject, idx) => (
              <span
                key={idx}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '50px',
                  background: selectedSubject === subject ? 'rgba(0, 102, 255, 0.05)' : 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  borderColor: selectedSubject === subject ? 'var(--primary-glow)' : 'var(--border-color)',
                }}
                onClick={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="section-padding container">
        <div className="section-header">
          <span className="section-subtitle">Student Feedback</span>
          <h2>What Students Say</h2>
          <p>Real feedback from students who've used our services.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {studentTestimonials.map((t, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} style={{ color: '#FFB020', fontSize: '1.2rem' }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)', flexGrow: 1 }}>"{t.quote}"</p>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{t.author}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.field} Student</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Contact Form */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="section-header">
            <h2>Get Started Today</h2>
            <p>Fill in the form below or chat with us on WhatsApp for immediate assistance.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="glass-card">
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter your name"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-dark)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>WhatsApp Number or Email</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleFormChange}
                placeholder="Your WhatsApp or email"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-dark)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Service Needed</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleFormChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-dark)',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select a service</option>
                <option value="Assignment Writing">Assignment & Essay Writing</option>
                <option value="Coding Help">Project Development & Coding Help</option>
                <option value="MS Office Install">Microsoft Office Installation</option>
                <option value="MS Office Activation">Microsoft App Activation</option>
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Brief Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                placeholder="Tell us more about what you need"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  backgroundColor: 'var(--bg-dark)',
                  color: 'var(--text-primary)',
                  minHeight: '120px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <button type="submit" className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center' }}>
              Send & Chat on WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding container">
        <div className="section-header">
          <span className="section-subtitle">Questions?</span>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'grid', gap: '2rem' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Is the work original and plagiarism-free?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Absolutely. All work is original and written from scratch. We provide plagiarism reports upon request.</p>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>How fast can you deliver?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Most assignments are completed within 24-48 hours. Urgent requests can be accommodated for an additional fee.</p>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>What subjects do you cover?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>We cover Mathematics, Computer Science, English, Business, Accounting, IT, Engineering, Physics, Chemistry, and more. Ask if your subject isn't listed.</p>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>How do I pay?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>We accept bank transfers, EFT, and mobile payment methods. Payment is secure and confidential.</p>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Is my privacy protected?</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Yes. Your information and work are completely confidential. We never share client details.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding container" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '4rem 2rem', maxWidth: '850px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Ready to get the support you need?</h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
            Chat with us on WhatsApp for immediate assistance, or fill out a quick form and we'll get back to you within the hour.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/27613991212?text=Hi! I need help with my assignments." target="_blank" rel="noopener noreferrer" className="neon-glow-btn" style={{ textDecoration: 'none' }}>
              <MessageSquare size={16} style={{ marginRight: '0.5rem' }} /> WhatsApp Now
            </a>
            <button onClick={() => setActiveTab('contact')} className="neon-outline-btn">
              Use Contact Form
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
