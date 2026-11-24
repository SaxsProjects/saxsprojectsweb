import { useState } from 'react';
import { business, whatsappLink } from '../config/business';
import { buildPackages, formatRange, packageMax, packageMin, techServices } from '../config/pricing';
import { Monitor, Code, Smartphone, Database, Settings, Wrench, Check, Clock, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export default function TechSolutions({ setActiveTab }) {
  const [quoteForm, setQuoteForm] = useState({ name: '', contact: '', service: 'Business Website Design', message: '' });

  const services = [
    {
      icon: <Monitor size={40} style={{ color: 'var(--primary-glow)' }} />,
      title: "Business Website Design",
      range: formatRange(packageMin('website'), packageMax('website')),
      time: buildPackages.website.days,
      summary: "High-performance digital presence built to capture leads, rank on Google, and engage local users.",
      deliverables: [
        "Fully mobile-responsive design",
        "SEO-optimized structure",
        "Contact forms and lead capture",
        "Fast loading times",
        "Professional branding integration",
        "Google Analytics setup"
      ],
      why: "Your business needs a digital foundation that works 24/7, capturing leads while you sleep."
    },
    {
      icon: <Code size={40} style={{ color: 'var(--primary-glow)' }} />,
      title: "Custom Web Applications",
      range: formatRange(packageMin('webapp'), packageMax('webapp')),
      time: buildPackages.webapp.days,
      summary: "Dynamic web portals designed for data management, client workflows, invoicing, and automation.",
      deliverables: [
        "Interactive dashboards",
        "Secure user authentication",
        "Database integration",
        "Real-time data sync",
        "Custom API development",
        "Invoice automation"
      ],
      why: "Streamline your operations with software built specifically for your business workflows."
    },
    {
      icon: <Smartphone size={40} style={{ color: 'var(--primary-glow)' }} />,
      title: "Mobile App Development",
      range: formatRange(packageMin('mobile'), packageMax('mobile')),
      time: buildPackages.mobile.days,
      summary: "Native iOS and Android apps that put your business directly into customers' pockets.",
      deliverables: [
        "Cross-platform development (React Native/Flutter)",
        "App Store & Google Play ready",
        "Push notifications",
        "Cloud database integration",
        "User authentication",
        "Real-time synchronization"
      ],
      why: "Reach customers on mobile where they spend most of their time."
    },
    {
      icon: <Database size={40} style={{ color: 'var(--primary-glow)' }} />,
      title: "Database Design & Management",
      range: formatRange(techServices.database.min, techServices.database.max),
      time: techServices.database.time,
      summary: "Scalable, secure database architectures built for growth and performance.",
      deliverables: [
        "Database architecture design",
        "Data normalization",
        "Query optimization",
        "Backup strategies",
        "Security implementation",
        "Performance tuning"
      ],
      why: "A well-designed database is the backbone of every software system."
    },
    {
      icon: <Settings size={40} style={{ color: 'var(--primary-glow)' }} />,
      title: "Computer & Laptop Software Updates",
      range: formatRange(techServices.softwareUpdates.min, techServices.softwareUpdates.max),
      time: techServices.softwareUpdates.time,
      summary: "Professional software installation, updates, and configuration for optimal device performance.",
      deliverables: [
        "OS and driver updates",
        "Software optimization",
        "Performance monitoring",
        "Security patches",
        "Backup verification",
        "Post-update support"
      ],
      why: "Keep your systems running smoothly and securely with professional maintenance."
    },
    {
      icon: <Wrench size={40} style={{ color: 'var(--primary-glow)' }} />,
      title: "Computer & Laptop Repairs",
      range: formatRange(techServices.repairs.min, techServices.repairs.max),
      time: techServices.repairs.time,
      summary: "Professional diagnosis and repair for hardware and software issues.",
      deliverables: [
        "Hardware diagnostics",
        "Component replacement",
        "Software troubleshooting",
        "Data recovery services",
        "Performance optimization",
        "Warranty on repairs"
      ],
      why: "Get your devices back to peak performance quickly and professionally."
    }
  ];

  const techStack = [
    "JavaScript",
    "React.js",
    "Next.js",
    "Node.js",
    "HTML & CSS",
    "Firebase",
    "MongoDB",
    "SQL",
    "React Native",
    "Java",
    "PHP",
    "AWS"
  ];

  const portfolio = [
    {
      title: "BrainBox Quiz App",
      description: "Educational quiz application built with Kotlin for Android. Featured on developer portfolio.",
      type: "Mobile App",
      link: "https://github.com/saxs-14/BrainBox"
    }
  ];

  const handleQuoteChange = (e) => {
    const { name, value } = e.target;
    setQuoteForm(prev => ({ ...prev, [name]: value }));
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    const { name, contact, service, message } = quoteForm;
    const formattedMessage = `Hi SaxsProjects, I'm ${name || 'interested in a quote'}. I need: ${service}.\n\n${message || ''}\n\nBest way to reach me: ${contact}`;
    window.open(whatsappLink(formattedMessage), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="tech-solutions-container fade-in">
      {/* Hero Section */}
      <section className="hero-section container" style={{ padding: '6rem 0 4rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 102, 255, 0.08) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }}></div>

        <span className="section-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto 1.5rem', background: 'rgba(0, 102, 255, 0.05)', padding: '0.5rem 1.25rem', borderRadius: '50px', border: '1px solid rgba(0, 102, 255, 0.15)' }}>
          <Code size={14} style={{ color: 'var(--primary-glow)' }} />
          PROFESSIONAL TECH SOLUTIONS
        </span>

        <h1 style={{ fontSize: 'clamp(2.1rem, 6vw, 3.5rem)', lineHeight: '1.2', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
          From custom web apps to <span className="gradient-text">hardware repairs</span>
        </h1>

        <p style={{ fontSize: '1.25rem', maxWidth: '750px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)' }}>
          SaxsProjects delivers end-to-end tech solutions for businesses of all sizes. From simple business websites to complex web applications and mobile apps.
        </p>

        <p style={{ fontSize: '1rem', maxWidth: '750px', margin: '0 auto 2.5rem', color: 'var(--text-secondary)' }}>
          Direct, transparent service from a qualified developer. No corporate middlemen, just solid engineering.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('contact')} className="neon-glow-btn">
            Get a Free Quote <ArrowRight size={16} />
          </button>
          <a href={business.social.github} target="_blank" rel="noopener noreferrer" className="neon-outline-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ExternalLink size={16} /> View GitHub
          </a>
        </div>

        {/* Trust Badges */}
        <div className="trust-badge-row" style={{ marginTop: '5rem' }}>
          <div className="trust-badge">
            <ShieldCheck size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Written Quotations</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No surprise invoices</p>
            </div>
          </div>
          <div className="trust-badge">
            <ShieldCheck size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Direct Contact</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Talk to the developer</p>
            </div>
          </div>
          <div className="trust-badge">
            <Clock size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>30 Days Support</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Included after launch</p>
            </div>
          </div>
          <div className="trust-badge">
            <ShieldCheck size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>You Own Your Code</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>100% yours forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Expertise & Credentials</span>
            <h2>Why Trust SaxsProjects</h2>
            <p>Qualified developer with proven expertise and real-world experience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '2rem' }}>
            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={20} style={{ color: 'var(--primary-glow)' }} />
                Qualified Developer
              </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                Diploma in ICT: application development from University of Mpumalanga (awarded May 2026). Currently pursuing Advanced Diploma with distinctions in IT Project Management and Business Practice.
              </p>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={20} style={{ color: 'var(--primary-glow)' }} />
                National Competitor
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Selected for the CHPC High-Performance Computing national team (2025). Competing nationally in high-performance computing shows the depth behind every build.
              </p>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={20} style={{ color: 'var(--primary-glow)' }} />
                Real-World Projects
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Built BrainBox, an educational quiz application in Kotlin. See our work on GitHub. Proven ability to deliver functional, well-architected software.
              </p>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={20} style={{ color: 'var(--primary-glow)' }} />
                University Tutor
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Serves as university tutor and student support specialist. Understands technical problems deeply and can explain complex concepts clearly.
              </p>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={20} style={{ color: 'var(--primary-glow)' }} />
                Full Tech Stack
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Expert in JavaScript, React, Node.js, MongoDB, Firebase, React Native, and more. From frontend to backend, databases to deployment.
              </p>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={20} style={{ color: 'var(--primary-glow)' }} />
                Local & Accessible
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Based in South Africa, serving local businesses and startups. Direct support line, no outsourcing, personal attention to your project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding container">
        <div className="section-header">
          <span className="section-subtitle">Services & Scope</span>
          <h2>What We Build</h2>
          <p>Bespoke digital solutions with clear scopes, timelines, and outcomes. No mystery billing.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))', gap: '3rem' }}>
          {services.map((s, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-deep)', border: '1px solid var(--border-color)' }}>
                    {s.icon}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>PRICE</p>
                    <p style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>Written quote</p>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{s.title}</h3>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{s.summary}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  <Clock size={16} style={{ color: 'var(--primary-glow)' }} /> Delivery: {s.time}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Deliverables</p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
                    {s.deliverables.map((del, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0, marginTop: '0.2rem' }} />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
                  "{s.why}"
                </p>
                <button onClick={() => setActiveTab('contact')} className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center' }}>
                  Get a Quote <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Technical Expertise</span>
            <h2>Tech Stack & Skills</h2>
            <p>Full-stack developer proficient across the entire technology spectrum.</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {techStack.map((tech, idx) => (
              <span
                key={idx}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '50px',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--primary-glow)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-glow)';
                  e.currentTarget.style.background = 'rgba(0, 102, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--card-bg)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Check size={14} />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      {portfolio.length > 0 && (
        <section className="section-padding container">
          <div className="section-header">
            <span className="section-subtitle">Our Work</span>
            <h2>Portfolio Projects</h2>
            <p>Real projects built with real expertise. See what we deliver.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {portfolio.map((project, idx) => (
              <div key={idx} className="glass-card">
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ display: 'inline-block', padding: '0.5rem 0.75rem', borderRadius: '50px', background: 'rgba(0, 102, 255, 0.1)', color: 'var(--primary-glow)', fontSize: '0.75rem', fontWeight: 700 }}>
                    {project.type}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{project.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  {project.description}
                </p>
                <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-glow)', fontWeight: 600, textDecoration: 'none' }}>
                  View Project <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Quote Form */}
      <section className="section-padding container" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="section-header">
          <span className="section-subtitle">Quick Quote</span>
          <h2>Request a Custom Tech Quote</h2>
          <p>Fill in the details below and we'll reply on WhatsApp with a tailored proposal.</p>
        </div>

        <form onSubmit={handleQuoteSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Name
            <input
              type="text"
              name="name"
              value={quoteForm.name}
              onChange={handleQuoteChange}
              required
              placeholder="Your name"
              style={{ padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            WhatsApp / Email
            <input
              type="text"
              name="contact"
              value={quoteForm.contact}
              onChange={handleQuoteChange}
              required
              placeholder="Email or WhatsApp number"
              style={{ padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Service
            <select
              name="service"
              value={quoteForm.service}
              onChange={handleQuoteChange}
              style={{ padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)' }}
            >
              {services.map((s, idx) => (
                <option key={idx} value={s.title}>{s.title}</option>
              ))}
            </select>
          </label>

          <label style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Brief Message
            <textarea
              name="message"
              value={quoteForm.message}
              onChange={handleQuoteChange}
              placeholder="Tell us about your business goals or current pain points"
              rows={4}
              style={{ padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', resize: 'vertical' }}
            />
          </label>

          <button type="submit" className="neon-glow-btn" style={{ gridColumn: '1 / -1', justifySelf: 'center', padding: '1rem 2rem', fontSize: '1rem' }}>
            Send Request on WhatsApp <ArrowRight size={16} />
          </button>
        </form>
      </section>

      {/* FAQ Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="section-header">
            <span className="section-subtitle">Questions?</span>
            <h2>Tech Solutions FAQ</h2>
          </div>

          <div style={{ display: 'grid', gap: '2rem' }}>
            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>What's the typical timeline for a project?</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Websites: 10-14 days. Web apps: 14-21 days. Mobile apps: 21-30 days. Urgent requests can be expedited with additional fees.</p>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Do I own the code and website after completion?</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Yes, 100%. You own all code, designs, and content. There are no licensing restrictions or ongoing dependencies on us.</p>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Can you host the website or app?</h3>
              <p style={{ color: 'var(--text-secondary)' }}>We provide hosting recommendations and setup. Most projects are hosted on AWS, Firebase, or your preferred platform for flexibility.</p>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Do you offer post-launch support?</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Yes. Every project includes 30 days of post-launch support. Extended support packages are available for ongoing maintenance.</p>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>How do you handle remote work?</h3>
              <p style={{ color: 'var(--text-secondary)' }}>We work entirely remotely via WhatsApp, email, and video calls. You can be anywhere—we're accessible and responsive.</p>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Can you help with existing code or legacy systems?</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Absolutely. We can audit, refactor, optimize, or extend existing projects. Contact us for a detailed assessment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding container" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '4rem 2rem', maxWidth: '850px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Ready to build your digital foundation?</h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
            Get a completely transparent quote with clear scope, timeline, and deliverables. Zero commitment required.
          </p>
          <button onClick={() => setActiveTab('contact')} className="neon-glow-btn">
            Book a Free Consultation <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
