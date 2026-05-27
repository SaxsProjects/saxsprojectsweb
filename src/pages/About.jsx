
import { Award, Heart, CheckCircle, Calendar, Target, ExternalLink } from 'lucide-react';
import ownerPhoto from '../assets/owner-photo.jpeg';

export default function About() {
  const qualifications = [
    {
      title: "Diploma in ICT: application development",
      school: "University of Mpumalanga",
      awarded: "May 2026",
      highlights: ["Business Practice: 83% (Distinction)", "IT Project Management: 78% (Distinction)", "Project 300: 75% (Distinction)"]
    },
    {
      title: "Advanced Diploma in ICT: application development",
      school: "University of Mpumalanga",
      awarded: "2026 (Ongoing)",
      highlights: ["NQF Level 7", "Building on Diploma foundation"]
    }
  ];

  const achievements = [
    {
      year: "2025",
      milestone: "Selected for CHPC National Team",
      description: "Chosen for the High-Performance Computing national competition"
    },
    {
      year: "2026",
      milestone: "Diploma Awarded (May)",
      description: "ICT: application development from University of Mpumalanga with Distinctions"
    },
    {
      year: "2024-2026",
      milestone: "Academic Mentor & Educator",
      description: "Served as lecturer assistant and mentor, helping students master core concepts and develop problem-solving skills"
    },
    {
      year: "2024",
      milestone: "BrainBox Project",
      description: "Built educational quiz app in Kotlin for Android platform"
    }
  ];

  const stack = [
    { name: "Java", role: "Backend & Systems" },
    { name: "Kotlin", role: "Android Development" },
    { name: "JavaScript", role: "Frontend Logic" },
    { name: "React", role: "UI Library" },
    { name: "React Native", role: "Cross-Platform Mobile" },
    { name: "Node.js", role: "Backend Runtime" },
    { name: "PHP", role: "Web Development" },
    { name: "Next.js", role: "Modern Web Apps" },
    { name: "HTML", role: "Semantic Structure" },
    { name: "CSS", role: "Styling" },
    { name: "SQL", role: "Database Engineering" },
    { name: "MongoDB", role: "NoSQL Database" },
    { name: "Firebase", role: "Real-time Cloud" },
    { name: "AWS", role: "Cloud Hosting" },
    { name: "C++", role: "System Programming" },
    { name: "Linux", role: "Server Operations" }
  ];

  return (
    <div className="about-container fade-in">
      {/* Hero Section with Owner Photo & Bio */}
      <section className="section-padding container" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-5%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 102, 255, 0.08) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }}></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
          {/* Owner Photo Section */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: '300px',
              borderRadius: '20px',
              background: 'var(--bg-pure)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: 'var(--card-shadow-hover)',
              position: 'relative',
              transition: 'all 0.3s ease'
            }}>
              {/* Photo */}
              <div style={{
                width: '100%',
                height: '300px',
                background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.15), rgba(0, 102, 255, 0.08))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img src={ownerPhoto} alt="Phathutshedzo Mamagau - Diploma in ICT" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {/* Info Badge */}
              <div style={{
                padding: '1.25rem',
                textAlign: 'center',
                background: 'var(--bg-pure)'
              }}>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Phathutshedzo Mamagau</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary-glow)', fontWeight: 600, marginBottom: '0.5rem' }}>Diploma in ICT: application development</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>University of Mpumalanga 2026</p>
              </div>
            </div>
          </div>

          {/* Introduction & Credentials */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', lineHeight: '1.2' }}>
                Hi, I'm <span style={{ color: 'var(--primary-glow)' }}>Phathutshedzo Mamagau</span>
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.7' }}>
                Diploma-qualified software developer and university tutor. I combine professional development expertise with genuine passion for education and innovation.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                {qualifications.map((qual, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <Award size={18} style={{ color: 'var(--primary-glow)' }} />
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase' }}>
                        {qual.awarded}
                      </p>
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {qual.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      {qual.school}
                    </p>
                    <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {qual.highlights.map((h, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <CheckCircle size={12} style={{ color: 'var(--primary-glow)', flexShrink: 0, marginTop: '0.15rem' }} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why I Started Both Services Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Story</span>
            <h2>Why Tech Solutions & Student Services?</h2>
            <p>The evolution of SaxsProjects reflects my commitment to both business and education.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Target size={24} style={{ color: 'var(--primary-glow)' }} />
                Tech Solutions
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                As a qualified full-stack developer, I built SaxsProjects to serve businesses needing digital foundations. I handle every aspect: design, development, databases, hosting, and ongoing support. No middlemen. Direct excellence.
              </p>
            </div>

            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Heart size={24} style={{ color: 'var(--primary-glow)' }} />
                Student Services
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                Having worked as a university tutor and student support specialist, I understand exactly where students struggle. I launched student services to close the gap between academic work and tech skills — that's my passion.
              </p>
            </div>
          </div>

          {/* Mission Statement */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1rem', fontStyle: 'italic' }}>
                "My mission is simple: help businesses grow through technology and help students succeed through expert guidance. Both require genuine expertise, transparency, and dedication."
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                — Phathutshedzo Mamagau, Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements & Credentials Timeline */}
      <section className="section-padding container">
        <div className="section-header">
          <span className="section-subtitle">Milestones</span>
          <h2>My Journey</h2>
          <p>Key achievements that demonstrate commitment to excellence.</p>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {achievements.map((achievement, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', position: 'relative', paddingLeft: '0', paddingBottom: '2rem', borderLeft: idx !== achievements.length - 1 ? '2px solid var(--border-color)' : 'none' }}>
              {/* Timeline dot */}
              <div style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                background: 'var(--primary-glow)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 700,
                boxShadow: 'var(--card-shadow)',
                flexShrink: 0
              }}>
                <Calendar size={16} />
              </div>

              {/* Content */}
              <div style={{ paddingTop: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--primary-glow)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {achievement.year}
                </p>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {achievement.milestone}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Technical Arsenal</span>
            <h2>Full Development Stack</h2>
            <p>Expert proficiency across frontend, backend, databases, and cloud platforms.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
            {stack.map((tech, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {tech.name}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {tech.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose SaxsProjects */}
      <section className="section-padding container">
        <div className="section-header">
          <h2>Why Work With Me?</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} style={{ color: 'var(--primary-glow)' }} />
              Qualified & Verified
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Diploma in ICT with Distinctions. Recognized by university for tutoring expertise. Selected for national CHPC competition.
            </p>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} style={{ color: 'var(--primary-glow)' }} />
              Direct & Transparent
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Solo developer = no middlemen. You communicate directly with the person building your project. 100% accountability.
            </p>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} style={{ color: 'var(--primary-glow)' }} />
              Educational Background
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              University tutor and student support specialist. I explain complex concepts clearly and ensure you understand your own system.
            </p>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} style={{ color: 'var(--primary-glow)' }} />
              Real Projects
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Built BrainBox educational app in Kotlin. See real code on GitHub. Not just talk — proven delivery.
            </p>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} style={{ color: 'var(--primary-glow)' }} />
              You Own Everything
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              100% ownership of code, design, and systems. No licensing. No lock-in. Your digital foundation, your way.
            </p>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} style={{ color: 'var(--primary-glow)' }} />
              South African Based
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              Located in Thohoyandou, Limpopo. Direct support line. Understanding of local business and education needs.
            </p>
          </div>
        </div>
      </section>

      {/* GitHub & Social Links */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: '2rem' }}>See My Work</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Explore my GitHub profile to see real projects and code quality.
          </p>
          <a
            href="https://github.com/saxs-14"
            target="_blank"
            rel="noopener noreferrer"
            className="neon-glow-btn"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ExternalLink size={18} />
            github.com/saxs-14
            <ExternalLink size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
