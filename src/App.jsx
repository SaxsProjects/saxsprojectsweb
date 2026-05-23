import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Services from './pages/Services';
import HowWeWork from './pages/HowWeWork';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Blog from './pages/Blog';
import ClientDashboard from './pages/ClientDashboard';
import Contact from './pages/Contact';
import OAuthCallback from './pages/OAuthCallback';

import { db } from "../firebase-config";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

// Logo Asset
import logoImg from './assets/logo.png';

// Icons
import { Menu, X, Phone, MessageSquare, Send, MessageCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeQuote, setPrefilledQuote] = useState(null);
  
  // Check if we're on callback page
  const isOAuthCallback = window.location.pathname === '/callback';

  // Live Cloud Chat States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'support', text: "👋 Welcome to SaxsProjects! Ask us anything about websites, web apps, or timelines.", time: "15:45" }
  ]);
  const [unreadCount, setUnreadCount] = useState(1);
  const [chatSessionId, setChatSessionId] = useState('');

  // 1. Initialize session and bind Firestore Listener
  useEffect(() => {
    let sessionId = sessionStorage.getItem('saxsprojects_chat_session');
    if (!sessionId) {
      const randomPart = Math.floor(100000 + Math.random() * 900000).toString(16);
      sessionId = `public_${randomPart}`;
      sessionStorage.setItem('saxsprojects_chat_session', sessionId);
    }
    setChatSessionId(sessionId);

    // Bind listener
    const messagesRef = collection(db, "chats", sessionId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        list.push({
          sender: data.sender,
          text: data.text,
          time: data.time || "Just now"
        });
      });
      
      if (list.length > 0) {
        setChatMessages(list);
      }
    }, (err) => {
      console.error("Firestore public chat subscriber error:", err);
    });

    return () => unsubscribe();
  }, []);

  // Update unread badges based on active state
  useEffect(() => {
    if (chatOpen) {
      setUnreadCount(0);
    }
  }, [chatOpen, chatMessages]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    const messageText = chatInput.trim();
    if (messageText === '' || !chatSessionId) return;

    setChatInput('');

    // Add user message to chat immediately
    const userMsg = { 
      sender: 'user', 
      text: messageText, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setChatMessages(prev => [...prev, userMsg]);

    try {
      // Try to store in Firestore for persistence
      const messagesRef = collection(db, "chats", chatSessionId, "messages");
      await addDoc(messagesRef, {
        sender: 'user',
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp(),
        isProcessed: false
      });
    } catch (err) {
      console.error("Error writing message to Firestore:", err);
      // Continue even if Firestore fails - we'll still get AI response via API
    }

    // Get AI response from backend
    try {
      const apiResponse = await fetch('http://localhost:5000/api/chat/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageText })
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        const aiMsg = { 
          sender: 'support', 
          text: data.reply, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setChatMessages(prev => [...prev, aiMsg]);
        
        // Also try to store AI response in Firestore
        try {
          const messagesRef = collection(db, "chats", chatSessionId, "messages");
          await addDoc(messagesRef, {
            sender: 'support',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: serverTimestamp(),
            isProcessed: true
          });
        } catch (err) {
          console.error("Error storing AI response in Firestore:", err);
        }
      } else {
        // API error - show generic response
        const aiMsg = { 
          sender: 'support', 
          text: "I'm experiencing technical difficulties. Please try again or contact us at Saxs.solutions25@gmail.com", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setChatMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Fallback: show local response
      setTimeout(() => {
        const aiMsg = { 
          sender: 'support', 
          text: "Hello! I'm the SaxsProjects AI Assistant. Ask me about our websites, web apps, mobile apps, pricing, or book your free 15-minute consultation!", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        };
        setChatMessages(prev => [...prev, aiMsg]);
      }, 500);
    }
  };

  const handleToggleChat = () => {
    setChatOpen(!chatOpen);
    setUnreadCount(0);
  };

  // Render OAuth callback page if on callback path
  if (isOAuthCallback) {
    return <OAuthCallback />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Navigation Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          
          {/* Logo */}
          <div onClick={() => handleTabChange('home')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img src={logoImg} alt="SaxsProjects" style={{ height: '42px', display: 'block', objectFit: 'contain' }} />
          </div>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
            <button onClick={() => handleTabChange('home')} style={{ background: 'transparent', border: 'none', color: activeTab === 'home' ? 'var(--primary-glow)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>Home</button>
            <button onClick={() => handleTabChange('services')} style={{ background: 'transparent', border: 'none', color: activeTab === 'services' ? 'var(--primary-glow)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>Services</button>
            <button onClick={() => handleTabChange('how-we-work')} style={{ background: 'transparent', border: 'none', color: activeTab === 'how-we-work' ? 'var(--primary-glow)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>How We Work</button>
            <button onClick={() => handleTabChange('pricing')} style={{ background: 'transparent', border: 'none', color: activeTab === 'pricing' ? 'var(--primary-glow)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>Pricing</button>
            <button onClick={() => handleTabChange('about')} style={{ background: 'transparent', border: 'none', color: activeTab === 'about' ? 'var(--primary-glow)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>About</button>
            <button onClick={() => handleTabChange('blog')} style={{ background: 'transparent', border: 'none', color: activeTab === 'blog' ? 'var(--primary-glow)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>Guides</button>
            <button onClick={() => handleTabChange('dashboard')} style={{ background: 'transparent', border: 'none', color: activeTab === 'dashboard' ? 'var(--primary-glow)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Portal</button>
            <button onClick={() => handleTabChange('contact')} className="neon-glow-btn" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>Consultation</button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            style={{ display: 'block', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fade-in" style={{ background: 'var(--bg-pure)', borderBottom: '1px solid var(--border-color)', padding: '1.5rem 0' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'flex-start' }}>
              <button onClick={() => handleTabChange('home')} style={{ background: 'transparent', border: 'none', color: activeTab === 'home' ? 'var(--primary-glow)' : 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>Home</button>
              <button onClick={() => handleTabChange('services')} style={{ background: 'transparent', border: 'none', color: activeTab === 'services' ? 'var(--primary-glow)' : 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>Services</button>
              <button onClick={() => handleTabChange('how-we-work')} style={{ background: 'transparent', border: 'none', color: activeTab === 'how-we-work' ? 'var(--primary-glow)' : 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>How We Work</button>
              <button onClick={() => handleTabChange('pricing')} style={{ background: 'transparent', border: 'none', color: activeTab === 'pricing' ? 'var(--primary-glow)' : 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>Pricing</button>
              <button onClick={() => handleTabChange('about')} style={{ background: 'transparent', border: 'none', color: activeTab === 'about' ? 'var(--primary-glow)' : 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>About</button>
              <button onClick={() => handleTabChange('blog')} style={{ background: 'transparent', border: 'none', color: activeTab === 'blog' ? 'var(--primary-glow)' : 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>Guides</button>
              <button onClick={() => handleTabChange('dashboard')} style={{ background: 'transparent', border: 'none', color: activeTab === 'dashboard' ? 'var(--primary-glow)' : 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>Client Portal</button>
              <button onClick={() => handleTabChange('contact')} className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center' }}>Consultation</button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        {activeTab === 'home' && <Home setActiveTab={handleTabChange} />}
        {activeTab === 'services' && <Services setActiveTab={handleTabChange} />}
        {activeTab === 'how-we-work' && <HowWeWork />}
        {activeTab === 'pricing' && <Pricing setActiveTab={handleTabChange} setPrefilledQuote={setPrefilledQuote} />}
        {activeTab === 'about' && <About />}
        {activeTab === 'blog' && <Blog />}
        {activeTab === 'dashboard' && <ClientDashboard />}
        {activeTab === 'contact' && <Contact activeQuote={activeQuote} clearActiveQuote={() => setPrefilledQuote(null)} setActiveTab={handleTabChange} />}
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', padding: '4rem 0 2rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <img src={logoImg} alt="SaxsProjects" style={{ height: '36px', display: 'block', marginBottom: '1.25rem', objectFit: 'contain' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Digital foundations for growing businesses. High fidelity code, absolute transparency, money-back protection.</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--primary-glow)', letterSpacing: '0.05em', marginBottom: '1rem' }}>Expertise</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>Vite & React Portals</li>
              <li>E-Commerce Integrations</li>
              <li>Next.js Applications</li>
              <li>Client dashboards</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--primary-glow)', letterSpacing: '0.05em', marginBottom: '1rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li onClick={() => handleTabChange('about')} style={{ cursor: 'pointer' }}>Developer Story</li>
              <li onClick={() => handleTabChange('how-we-work')} style={{ cursor: 'pointer' }}>Process Timeline</li>
              <li onClick={() => handleTabChange('blog')} style={{ cursor: 'pointer' }}>SEO Guides</li>
              <li onClick={() => handleTabChange('dashboard')} style={{ cursor: 'pointer' }}>Client Login</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--primary-glow)', letterSpacing: '0.05em', marginBottom: '1rem' }}>Get in Touch</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><a href="mailto:Saxs.solutions25@gmail.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Saxs.solutions25@gmail.com</a></li>
              <li>Call: <a href="tel:0714135824" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>0714135824</a> / <a href="tel:0613991212" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>0613991212</a></li>
              <li style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <a href="https://github.com/Saxs-14" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="GitHub - Saxs-14">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
                <a href="https://facebook.com/saxsprojects" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="Facebook - SaxsProjects">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://linkedin.com/in/saxsprojects" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="LinkedIn - SaxsProjects">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://wa.me/27613991212" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="WhatsApp"><MessageCircle size={18} /></a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="container" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} SaxsProjects. All rights reserved. • Built with Vite, React & Vanilla CSS.
        </div>
      </footer>

      {/* Floating simulated Live Chat widget */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
        {/* Floating Bubble */}
        <button 
          onClick={handleToggleChat}
          style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary-glow), var(--primary-neon))',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0, 102, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            transition: 'all 0.3s ease-in-out',
            position: 'relative'
          }}
          className="chat-bubble-btn"
        >
          {chatOpen ? <X size={24} /> : <MessageSquare size={24} />}
          
          {/* Unread badge */}
          {!chatOpen && unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--secondary-glow)', color: '#FFF', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, border: '2px solid var(--bg-dark)' }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Live Chat Panel */}
        {chatOpen && (
          <div className="fade-in glass-card" style={{ position: 'absolute', bottom: '80px', right: '0px', width: '340px', height: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.25rem', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow-hover)', borderRadius: '16px' }}>
            {/* Chat header */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00FF66', boxShadow: '0 0 8px #00FF66' }}></div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>SaxsProjects Live Sync</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Typical reply: Under 1 minute</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.875rem', padding: '0.75rem 0' }}>
              {chatMessages.map((msg, i) => {
                const isSupport = msg.sender === 'support';
                return (
                  <div key={i} style={{ alignSelf: isSupport ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                    <div 
                      style={{ 
                        background: isSupport ? 'var(--bg-deep)' : 'rgba(0, 102, 255, 0.08)', 
                        border: isSupport ? '1px solid var(--border-color)' : '1px solid rgba(0, 102, 255, 0.15)',
                        padding: '0.6rem 0.875rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1.4
                      }}
                    >
                      {msg.text}
                    </div>
                    <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: isSupport ? 'left' : 'right', marginTop: '0.2rem' }}>{msg.time}</p>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <input 
                type="text" 
                placeholder="Write a message..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{ flexGrow: 1, background: 'var(--bg-deep)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 0.75rem', borderRadius: '8px', outline: 'none', fontSize: '0.8rem' }}
              />
              <button type="submit" className="neon-glow-btn" style={{ padding: '0.5rem 0.75rem' }}>
                <Send size={12} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Global CSS Responsive Helpers styling injection */}
      <style>{`
        @media screen and (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
