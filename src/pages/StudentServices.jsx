import { useState } from 'react';
import { whatsappLink } from '../config/business';
import { formatZAR, studentServices } from '../config/pricing';
import { Lightbulb, Code, Wrench, BookOpen, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';

export default function StudentServices({ setActiveTab }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '', contact: '', service: '', message: '' });

  const services = [
    {
      icon: <BookOpen size={40} />,
      title: "Academic Tutoring & Concept Guidance",
      description: "One-on-one tutoring to help you understand complex concepts and master academic subjects",
      benefits: [
        "Personalized learning approach",
        "Clear concept explanations",
        "Problem-solving strategies"
      ],
      price: `From ${formatZAR(studentServices.tutoring.from)} ${studentServices.tutoring.unit}`.trim()
    },
    {
      icon: <Code size={40} />,
      title: "Programming & Coding Mentorship",
      description: "Expert guidance on coding concepts, debugging techniques, and software development best practices",
      benefits: [
        "Code review and optimization",
        "Best practices teaching",
        "Problem-solving methodology"
      ],
      price: `From ${formatZAR(studentServices.coding.from)} ${studentServices.coding.unit}`.trim()
    },
    {
      icon: <Lightbulb size={40} />,
      title: "Assignment Strategy & Guidance",
      description: "Learn how to approach, structure, and complete assignments with academic integrity at the core",
      benefits: [
        "Research methodology",
        "Citation and referencing support",
        "Writing techniques and structure"
      ],
      price: `From ${formatZAR(studentServices.assignmentStrategy.from)} ${studentServices.assignmentStrategy.unit}`.trim()
    },
    {
      icon: <Wrench size={40} />,
      title: "Tech Support & Software Setup",
      description: "Professional installation and configuration of Microsoft Office, development tools, and tech support",
      benefits: [
        "Quick installation and setup",
        "All components configured",
        "Technical support included"
      ],
      price: `From ${formatZAR(studentServices.techSetup.from)} ${studentServices.techSetup.unit}`.trim()
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = `Hi SaxsProjects, I'm ${formData.name}. I'm interested in: ${formData.service}.\n\n${formData.message}\n\nBest way to reach me: ${formData.contact}`;
    window.open(whatsappLink(whatsappMessage), '_blank', 'noopener,noreferrer');
    setFormData({ name: '', contact: '', service: '', message: '' });
  };

  return (
    <div className="learning-support-container fade-in">
      {/* Hero Section */}
      <section className="hero-section container" style={{ padding: '6rem 0 4rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 102, 255, 0.08) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }}></div>

        <span className="section-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto 1.5rem', background: 'rgba(0, 102, 255, 0.05)', padding: '0.5rem 1.25rem', borderRadius: '50px', border: '1px solid rgba(0, 102, 255, 0.15)' }}>
          <BookOpen size={14} style={{ color: 'var(--primary-glow)' }} />
          ACADEMIC & TECH SUPPORT
        </span>

        <h1 style={{ fontSize: 'clamp(2.1rem, 6vw, 3.5rem)', lineHeight: '1.2', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
          Master Your Skills & <span className="gradient-text">Succeed Academically</span>
        </h1>

        <p style={{ fontSize: '1.25rem', maxWidth: '750px', margin: '0 auto 2.5rem', color: 'var(--text-secondary)' }}>
          Professional tutoring, coding mentorship, and tech support from a qualified developer and educator. Learn with integrity and build real skills that matter.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={whatsappLink("Hi SaxsProjects! I'd like to learn more about your tutoring services.")} target="_blank" rel="noopener noreferrer" className="neon-glow-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={16} /> Chat on WhatsApp
          </a>
          <button onClick={() => setActiveTab('contact')} className="neon-outline-btn">
            Get More Info <ArrowRight size={16} />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="trust-badge-row" style={{ marginTop: '5rem' }}>
          <div className="trust-badge">
            <CheckCircle size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Academic Integrity</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Teaching & Learning Focus</p>
            </div>
          </div>
          <div className="trust-badge">
            <CheckCircle size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Expert Guidance</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Qualified Mentor & Developer</p>
            </div>
          </div>
          <div className="trust-badge">
            <CheckCircle size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Personalized Learning</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tailored to Your Needs</p>
            </div>
          </div>
          <div className="trust-badge">
            <CheckCircle size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Available Now</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Quick Response & Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Services</span>
            <h2>How We Support Your Success</h2>
            <p>Comprehensive guidance that builds your skills and promotes academic integrity.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '2rem' }}>
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
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>What You'll Get</p>
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
                  <a href={whatsappLink(`Hi SaxsProjects! I'm interested in: ${s.title}.`)} target="_blank" rel="noopener noreferrer" className="neon-glow-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    Learn More
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
          <h2>Getting Started</h2>
          <p>Three simple steps to begin your learning journey.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 1.5rem' }}>1</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Reach Out</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Contact us via WhatsApp or email with your learning goals and areas where you need support.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 1.5rem' }}>2</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Discuss Your Needs</h3>
            <p style={{ color: 'var(--text-secondary)' }}>We understand your challenges and create a personalized learning plan tailored to your goals.</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '0 auto 1.5rem' }}>3</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Learn & Grow</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Receive expert mentorship and build real skills with integrity. You'll understand your work, not just complete it.</p>
          </div>
        </div>
      </section>

      {/* Subjects Covered */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Expertise</span>
            <h2>Subjects & Fields We Cover</h2>
            <p>Expert tutoring and mentorship across a wide range of academic disciplines and technical skills.</p>
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

      {/* Quick Contact Form */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="section-header">
            <h2>Start Your Learning Journey</h2>
            <p>Fill in the form below or chat with us on WhatsApp to discuss how we can help you succeed.</p>
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>What You Need Help With</label>
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
                <option value="Academic Tutoring">Academic Tutoring & Concept Guidance</option>
                <option value="Coding Mentorship">Programming & Coding Mentorship</option>
                <option value="Assignment Strategy">Assignment Strategy & Guidance</option>
                <option value="Tech Support">Tech Support & Software Setup</option>
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Tell Us More</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                placeholder="Describe your learning goals and what you'd like to work on"
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
    </div>
  );
}

