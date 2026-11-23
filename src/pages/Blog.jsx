import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, ArrowLeft, Tag, Loader, ArrowRight } from 'lucide-react';
import { API_BASE_URL, hasBackend } from '../lib/api';

export default function Blog({ setActiveTab }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(hasBackend);

  useEffect(() => {
    if (!hasBackend) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/blogs`);
        if (res.ok && !cancelled) setPosts(await res.json());
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleReadMore = async (post) => {
    setSelectedPost(post);
    window.scrollTo(0, 0);
    try {
      const res = await fetch(`${API_BASE_URL}/blogs/${post.slug}`);
      if (res.ok) {
        const fullPost = await res.json();
        setSelectedPost(fullPost);
      }
    } catch (err) {
      console.error('Error fetching full post:', err);
    }
  };

  if (selectedPost) {
    return (
      <div className="blog-post-detail fade-in container section-padding" style={{ maxWidth: '800px' }}>
        <button 
          onClick={() => setSelectedPost(null)} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--primary-neon)', cursor: 'pointer', fontSize: '0.9rem', marginBottom: '2rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to guides
        </button>

        <span className="tech-badge" style={{ marginBottom: '1rem' }}>{selectedPost.category}</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>{selectedPost.title}</h1>
        
        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={14} /> {new Date(selectedPost.publishedAt).toLocaleDateString('en-ZA', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={14} /> {selectedPost.views || 0} views
          </span>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '3rem' }} className="blog-markdown">
          {selectedPost.content}
        </div>

        {selectedPost.tags && selectedPost.tags.length > 0 && (
          <div style={{ marginBottom: '3rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {selectedPost.tags.map((tag, idx) => (
              <span key={idx} style={{
                padding: '0.5rem 1rem',
                background: 'rgba(0, 102, 255, 0.1)',
                color: 'var(--primary-glow)',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Tag size={14} /> {tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: '4rem', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-deep)', textAlign: 'center' }}>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Ready to elevate your digital presence?</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>We build custom solutions that deliver results. Let's discuss your next project.</p>
          <button onClick={() => setActiveTab('contact')} className="neon-glow-btn" style={{ margin: '0 auto' }}>
            Book Consultation
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="blog-list-container fade-in container section-padding" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <Loader size={40} style={{ margin: '0 auto', color: 'var(--primary-glow)', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="blog-list-container fade-in container section-padding">
      <div className="section-header">
        <span className="section-subtitle">Knowledge Hub</span>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>SaxsProjects Guides</h1>
        <p>Expert insights on web development, digital strategy, and technology trends shaping modern business.</p>
      </div>

      {posts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '2rem', marginTop: '3rem' }}>
          {posts.map((post) => (
            <div 
              key={post._id}
              onClick={() => handleReadMore(post)}
              style={{
                background: 'var(--bg-pure)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              className="glass-card"
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {post.featured && (
                <span style={{ 
                  display: 'inline-block',
                  padding: '0.4rem 0.8rem',
                  background: 'rgba(255, 200, 0, 0.2)',
                  color: '#ffc800',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '1rem'
                }}>⭐ FEATURED</span>
              )}
              
              <span className="tech-badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>{post.category}</span>
              
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                {post.title}
              </h3>
              
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                {post.excerpt}
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {post.views || 0} views
                </span>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(0, 102, 255, 0.1)',
                      color: 'var(--primary-glow)',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div style={{
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--primary-glow)', fontWeight: 600, fontSize: '0.85rem' }}>
                  Read Article →
                </span>
                <BookOpen size={16} style={{ color: 'var(--primary-glow)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(0, 102, 255, 0.05)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
          <BookOpen size={40} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem' }}>
            Our first guides are on the way. In the meantime, ask us anything about getting your business online.
          </p>
          <button onClick={() => setActiveTab('contact')} className="neon-glow-btn">
            Ask a question <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
