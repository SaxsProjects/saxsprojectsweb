import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, FileText, DollarSign, TrendingUp, LogOut,
  Plus, Trash2, Edit2, Clock, AlertCircle, Database, BookOpen, Send, MessageCircle
} from 'lucide-react';
import { auth } from '../../firebase-config';
import { API_BASE_URL } from '../lib/api';

const ADMIN_EMAIL = 'saxs.solutions25@gmail.com';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');
  
  // Admin Stats
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalRevenue: 'R0 ZAR',
    pendingInvoices: 0,
    dbStatus: 'checking',
    apiStatus: 'checking'
  });

  // Lists
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientName, setNewClientName] = useState('');

  // Blog form states
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('General');
  const [blogContent, setBlogContent] = useState('');
  const [blogTags, setBlogTags] = useState('');
  const [blogFeatured, setBlogFeatured] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

  // Chat states
  const [selectedChatEmail, setSelectedChatEmail] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // Auto-load data on login
  useEffect(() => {
    if (isLoggedIn && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  async function loadDashboardData() {
    if (!auth.currentUser) return;
    
    try {
      const token = await auth.currentUser.getIdToken();
      
      // Check database and API status
      await checkConnections(token);
      
      // Load stats
      const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      // Load clients
      const clientsRes = await fetch(`${API_BASE_URL}/admin/clients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData);
      }

      // Load projects
      const projectsRes = await fetch(`${API_BASE_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }

      // Load invoices
      const invoicesRes = await fetch(`${API_BASE_URL}/admin/invoices`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData);
      }

      // Load blog posts
      const blogsRes = await fetch(`${API_BASE_URL}/admin/blogs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setBlogPosts(blogsData);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    }
  }

  const checkConnections = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/health/check`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          dbStatus: data.mongodb ? 'connected' : 'error',
          apiStatus: 'connected'
        }));
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setStats(prev => ({
        ...prev,
        dbStatus: 'error',
        apiStatus: 'error'
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setError('Only admin users (saxs.solutions25@gmail.com) can access this dashboard');
      return;
    }

    if (!password || password.trim().length === 0) {
      setError('Password is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      setError('Authentication failed. Please check your email and password.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!newClientEmail.trim() || !newClientName.trim()) {
      setError('Email and name are required');
      return;
    }

    if (!auth.currentUser) return;
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newClientEmail.toLowerCase(),
          name: newClientName
        })
      });

      if (res.ok) {
        setSuccess('Client added successfully');
        setNewClientEmail('');
        setNewClientName('');
        loadDashboardData();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to add client');
      }
    } catch (error) {
      setError('Error adding client: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    if (!auth.currentUser) return;
    setIsLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccess('Project deleted successfully');
        loadDashboardData();
      } else {
        setError('Failed to delete project');
      }
    } catch (error) {
      setError('Error deleting project: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Blog Management Handlers
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/admin/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: blogTitle,
          category: blogCategory,
          content: blogContent,
          tags: blogTags.split(',').map(t => t.trim()).filter(t => t),
          featured: blogFeatured
        })
      });

      if (res.ok) {
        setSuccess('Blog post published successfully!');
        setBlogTitle('');
        setBlogCategory('General');
        setBlogContent('');
        setBlogTags('');
        setBlogFeatured(false);
        setEditingBlogId(null);
        loadDashboardData();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to create blog post');
      }
    } catch (error) {
      setError('Error creating blog post: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/admin/blogs/${editingBlogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: blogTitle,
          category: blogCategory,
          content: blogContent,
          tags: blogTags.split(',').map(t => t.trim()).filter(t => t),
          featured: blogFeatured
        })
      });

      if (res.ok) {
        setSuccess('Blog post updated successfully!');
        setBlogTitle('');
        setBlogCategory('General');
        setBlogContent('');
        setBlogTags('');
        setBlogFeatured(false);
        setEditingBlogId(null);
        loadDashboardData();
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to update blog post');
      }
    } catch (error) {
      setError('Error updating blog post: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    
    if (!auth.currentUser) return;
    setIsLoading(true);

    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_BASE_URL}/admin/blogs/${blogId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setSuccess('Blog post deleted successfully');
        setBlogTitle('');
        setBlogCategory('General');
        setBlogContent('');
        setBlogTags('');
        setBlogFeatured(false);
        setEditingBlogId(null);
        loadDashboardData();
      } else {
        setError('Failed to delete blog post');
      }
    } catch (error) {
      setError('Error deleting blog post: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBlog = (post) => {
    setBlogTitle(post.title);
    setBlogCategory(post.category);
    setBlogContent(post.content);
    setBlogTags(post.tags.join(', '));
    setBlogFeatured(post.featured);
    setEditingBlogId(post._id);
    setCurrentTab('blog');
  };

  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.05), rgba(255, 51, 102, 0.05))',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 102, 255, 0.2)',
          padding: '3rem 2.5rem',
          maxWidth: '450px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: '70px',
              height: '70px',
              margin: '0 auto 1rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(255, 51, 102, 0.1), rgba(0, 102, 255, 0.1))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(0, 102, 255, 0.3)'
            }}>
              <BarChart3 size={32} style={{ color: '#FF3366' }} />
            </div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#070e17', fontWeight: 700 }}>Admin Control Center</h1>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>Restricted access - Admin only</p>
          </div>

          {error && (
            <div style={{
              background: '#fee',
              color: '#c00',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              border: '1px solid #fcc'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: '#FF3366', 
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}>Admin Email</label>
              <input 
                type="email" 
                placeholder="" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(0, 102, 255, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: '#fafafa',
                  fontWeight: 500
                }}
                required
              />
              <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.3rem', margin: '0.3rem 0 0 0' }}>Must be saxs.solutions25@gmail.com</p>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#FF3366',
                textTransform: 'uppercase',
                marginBottom: '0.5rem'
              }}>Secure Password</label>
              <input 
                type="password" 
                placeholder="" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(0, 102, 255, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: '#fafafa'
                }}
                required
              />
              <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.3rem', margin: '0.3rem 0 0 0' }}>Minimum 6 characters</p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                padding: '0.9rem 1.5rem',
                background: isLoading ? 'rgba(255, 51, 102, 0.5)' : 'linear-gradient(135deg, #FF3366, #FF0055)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                marginTop: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                boxShadow: 'rgba(255, 51, 102, 0.3) 0 4px 15px'
              }}
            >
              {isLoading ? 'Verifying Access...' : 'Login to Admin Panel'}
            </button>
          </form>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(0, 102, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 102, 255, 0.2)',
            fontSize: '0.8rem',
            color: '#666'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#070e17' }}>🔐 Secure Access Required</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.75rem' }}>This admin dashboard is restricted to authorized administrators only. Unauthorized access attempts are logged.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #070e17, #0d1b2a)' }}>
      {/* Header */}
      <header style={{
        background: 'rgba(7, 14, 23, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 102, 255, 0.2)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ color: '#0066ff', margin: '0', fontSize: '1.5rem' }}>SaxsProjects Admin</h1>
          <p style={{ color: '#8da2bb', margin: '0.25rem 0 0 0', fontSize: '0.85rem' }}>Management & Analytics Portal</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 51, 102, 0.2)',
            color: '#ff3366',
            border: '1px solid rgba(255, 51, 102, 0.3)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </header>

      {/* Connection Status */}
      <div style={{
        padding: '1.5rem 2rem',
        background: 'rgba(0, 102, 255, 0.05)',
        borderBottom: '1px solid rgba(0, 102, 255, 0.2)',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={16} style={{ color: stats.dbStatus === 'connected' ? '#00ff66' : '#ff3366' }} />
          <span style={{ color: stats.dbStatus === 'connected' ? '#00ff66' : '#ff3366', fontSize: '0.85rem' }}>
            MongoDB: {stats.dbStatus}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} style={{ color: stats.apiStatus === 'connected' ? '#00ff66' : '#ff3366' }} />
          <span style={{ color: stats.apiStatus === 'connected' ? '#00ff66' : '#ff3366', fontSize: '0.85rem' }}>
            API: {stats.apiStatus}
          </span>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div style={{
          margin: '1rem 2rem 0',
          padding: '1rem',
          background: 'rgba(255, 51, 102, 0.1)',
          border: '1px solid rgba(255, 51, 102, 0.3)',
          borderRadius: '6px',
          color: '#ff3366',
          fontSize: '0.85rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          margin: '1rem 2rem 0',
          padding: '1rem',
          background: 'rgba(0, 255, 102, 0.1)',
          border: '1px solid rgba(0, 255, 102, 0.3)',
          borderRadius: '6px',
          color: '#00ff66',
          fontSize: '0.85rem'
        }}>
          {success}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{
        padding: '1rem 2rem',
        borderBottom: '1px solid rgba(0, 102, 255, 0.2)',
        display: 'flex',
        gap: '1rem'
      }}>
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'clients', label: 'Clients', icon: Users },
          { id: 'projects', label: 'Projects', icon: FileText },
          { id: 'invoices', label: 'Invoices', icon: DollarSign },
          { id: 'blog', label: 'Blog', icon: BookOpen },
          { id: 'chat', label: 'Client Chat', icon: MessageCircle }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: currentTab === tab.id ? 'rgba(0, 102, 255, 0.2)' : 'transparent',
              color: currentTab === tab.id ? '#0066ff' : '#8da2bb',
              border: currentTab === tab.id ? '1px solid rgba(0, 102, 255, 0.4)' : 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ padding: '2rem' }}>
        {/* Overview Tab */}
        {currentTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Total Clients', value: stats.totalClients, icon: Users, color: '#0066ff' },
              { label: 'Total Projects', value: stats.totalProjects, icon: FileText, color: '#00ff66' },
              { label: 'Total Revenue', value: stats.totalRevenue, icon: TrendingUp, color: '#ffaa00' },
              { label: 'Pending Invoices', value: stats.pendingInvoices, icon: Clock, color: '#ff3366' }
            ].map((stat, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 102, 255, 0.2)',
                borderRadius: '8px',
                padding: '1.5rem',
                color: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ color: '#8da2bb', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>{stat.label}</p>
                    <h3 style={{ color: stat.color, margin: '0', fontSize: '1.75rem' }}>{stat.value}</h3>
                  </div>
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clients Tab */}
        {currentTab === 'clients' && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 102, 255, 0.2)',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: '#0066ff', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} /> Add New Client
              </h3>
              <form onSubmit={handleAddClient} style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="email"
                  placeholder="Client Email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(0, 102, 255, 0.3)',
                    borderRadius: '6px',
                    color: 'white',
                    outline: 'none'
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="Client Name"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(0, 102, 255, 0.3)',
                    borderRadius: '6px',
                    color: 'white',
                    outline: 'none'
                  }}
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#0066ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1
                  }}
                >
                  Add Client
                </button>
              </form>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(0, 102, 255, 0.2)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gap: '1rem',
                padding: '1.5rem',
                borderBottom: '1px solid rgba(0, 102, 255, 0.2)',
                background: 'rgba(0, 102, 255, 0.1)',
                fontWeight: 600,
                color: '#0066ff',
                fontSize: '0.85rem'
              }}>
                <div>Email</div>
                <div>Created</div>
                <div>Projects</div>
              </div>
              {clients.length > 0 ? (
                clients.map((client, idx) => (
                  <div key={idx} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    gap: '1rem',
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
                    color: '#dbe4ef',
                    fontSize: '0.85rem',
                    alignItems: 'center'
                  }}>
                    <div>{client.email}</div>
                    <div>{new Date(client.createdAt).toLocaleDateString()}</div>
                    <div>{projects.filter(p => p.clientEmail === client.email).length}</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#8da2bb' }}>
                  No clients yet. Add your first client above.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {currentTab === 'projects' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(0, 102, 255, 0.2)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {projects.length > 0 ? (
              projects.map((project, idx) => (
                <div key={idx} style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ color: 'white' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#0066ff' }}>{project.title}</h4>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#8da2bb' }}>Client: {project.clientEmail}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#8da2bb' }}>Progress: {project.progress}%</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(255, 51, 102, 0.2)',
                      color: '#ff3366',
                      border: '1px solid rgba(255, 51, 102, 0.3)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#8da2bb' }}>
                No projects found.
              </div>
            )}
          </div>
        )}

        {/* Invoices Tab */}
        {currentTab === 'invoices' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(0, 102, 255, 0.2)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {invoices.length > 0 ? (
              invoices.map((invoice, idx) => (
                <div key={idx} style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid rgba(0, 102, 255, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ color: 'white', flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#0066ff' }}>{invoice.title}</h4>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#8da2bb' }}>Invoice: {invoice.invoiceId}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#8da2bb' }}>Amount: {invoice.amount}</p>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: invoice.status === 'PAID' ? 'rgba(0, 255, 102, 0.2)' : 'rgba(255, 170, 0, 0.2)',
                    color: invoice.status === 'PAID' ? '#00ff66' : '#ffaa00'
                  }}>
                    {invoice.status}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#8da2bb' }}>
                No invoices found.
              </div>
            )}
          </div>
        )}

        {/* Blog Tab */}
        {currentTab === 'blog' && (
          <div style={{ padding: '2rem' }}>
            {/* Blog Post Form */}
            <div style={{
              background: 'rgba(0, 102, 255, 0.05)',
              border: '1px solid rgba(0, 102, 255, 0.2)',
              padding: '2rem',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#0066ff' }}>
                {editingBlogId ? '✏️ Edit Blog Post' : '✍️ Write New Blog Post'}
              </h3>
              
              <form onSubmit={editingBlogId ? handleUpdateBlog : handleCreateBlog} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0066ff', marginBottom: '0.5rem' }}>Title</label>
                  <input
                    type="text"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Enter blog post title"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(0, 102, 255, 0.3)',
                      background: 'var(--bg-pure)',
                      color: 'white'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0066ff', marginBottom: '0.5rem' }}>Category</label>
                    <select
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(0, 102, 255, 0.3)',
                        background: 'var(--bg-pure)',
                        color: 'white'
                      }}
                    >
                      <option>General</option>
                      <option>Web Development</option>
                      <option>Design</option>
                      <option>Technology</option>
                      <option>Business</option>
                      <option>Tutorial</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0066ff', marginBottom: '0.5rem' }}>Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={blogTags}
                      onChange={(e) => setBlogTags(e.target.value)}
                      placeholder="e.g., react, webdev, tutorial"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(0, 102, 255, 0.3)',
                        background: 'var(--bg-pure)',
                        color: 'white'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0066ff', marginBottom: '0.5rem' }}>Content</label>
                  <textarea
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="Write your blog post content here..."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(0, 102, 255, 0.3)',
                      background: 'var(--bg-pure)',
                      color: 'white',
                      minHeight: '200px',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#8da2bb' }}>
                    <input
                      type="checkbox"
                      checked={blogFeatured}
                      onChange={(e) => setBlogFeatured(e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.85rem' }}>Feature this post</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      marginLeft: 'auto',
                      padding: '0.75rem 1.5rem',
                      background: '#0066ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Send size={16} />
                    {isLoading ? 'Publishing...' : editingBlogId ? 'Update Post' : 'Publish Post'}
                  </button>

                  {editingBlogId && (
                    <button
                      type="button"
                      onClick={() => {
                        setBlogTitle('');
                        setBlogCategory('General');
                        setBlogContent('');
                        setBlogTags('');
                        setBlogFeatured(false);
                        setEditingBlogId(null);
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'transparent',
                        color: '#8da2bb',
                        border: '1px solid #1e3a5f',
                        borderRadius: '6px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Published Posts List */}
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#0066ff' }}>Published Posts ({blogPosts.length})</h3>
              
              {blogPosts.length > 0 ? (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {blogPosts.map((post) => (
                    <div key={post._id} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(0, 102, 255, 0.2)',
                      padding: '1.5rem',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: '#0066ff' }}>
                            {post.featured && '⭐ '}{post.title}
                          </h4>
                          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#8da2bb' }}>
                            <span>{post.category}</span>
                            <span>📊 {post.views} views</span>
                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <p style={{ margin: '0.5rem 0', color: '#dbe4ef', fontSize: '0.9rem', lineHeight: 1.5 }}>
                            {post.excerpt}
                          </p>
                          {post.tags && post.tags.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                              {post.tags.map((tag, idx) => (
                                <span key={idx} style={{
                                  padding: '0.25rem 0.5rem',
                                  background: 'rgba(0, 102, 255, 0.1)',
                                  color: '#0066ff',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600
                                }}>
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleEditBlog(post)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              background: 'rgba(0, 102, 255, 0.2)',
                              color: '#0066ff',
                              border: '1px solid rgba(0, 102, 255, 0.4)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(post._id)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              background: 'rgba(255, 69, 69, 0.2)',
                              color: '#ff4545',
                              border: '1px solid rgba(255, 69, 69, 0.4)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  color: '#8da2bb',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '8px',
                  border: '1px dashed rgba(0, 102, 255, 0.2)'
                }}>
                  <BookOpen size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>No blog posts yet. Create your first post above to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {currentTab === 'chat' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '2rem',
            maxHeight: '600px'
          }}>
            {/* Client List */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(0, 102, 255, 0.2)',
              borderRadius: '8px',
              padding: '1.5rem',
              overflowY: 'auto'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#0066ff', fontSize: '1rem' }}>
                <MessageCircle size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Clients
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#8da2bb', marginBottom: '1rem' }}>
                Note: Chat interface syncs with Firestore. Click a client to view and respond to messages.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <button
                      key={client._id || client.email}
                      onClick={() => setSelectedChatEmail(client.email)}
                      style={{
                        padding: '0.75rem',
                        background: selectedChatEmail === client.email ? 'rgba(0, 102, 255, 0.2)' : 'rgba(0, 102, 255, 0.05)',
                        border: selectedChatEmail === client.email ? '1px solid #0066ff' : '1px solid rgba(0, 102, 255, 0.1)',
                        color: selectedChatEmail === client.email ? '#0066ff' : '#8da2bb',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {client.name || 'Unknown'}
                      <div style={{ fontSize: '0.7rem', color: '#8da2bb', marginTop: '0.2rem' }}>
                        {client.email}
                      </div>
                    </button>
                  ))
                ) : (
                  <p style={{ fontSize: '0.8rem', color: '#8da2bb', textAlign: 'center', padding: '2rem 0' }}>
                    No clients yet
                  </p>
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedChatEmail ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(0, 102, 255, 0.2)',
                borderRadius: '8px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#0066ff', fontSize: '1rem' }}>
                    Chat with {clients.find(c => c.email === selectedChatEmail)?.name || selectedChatEmail}
                  </h3>
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '6px',
                    padding: '1rem',
                    height: '300px',
                    overflowY: 'auto',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <p style={{ fontSize: '0.8rem', color: '#8da2bb', textAlign: 'center' }}>
                      ℹ️ Messages from Firestore will appear here.
                      <br />
                      Full implementation requires Firestore listener setup.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <textarea
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="Type your response..."
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'var(--bg-pure)',
                      border: '1px solid rgba(0, 102, 255, 0.2)',
                      color: '#dbe4ef',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      resize: 'none',
                      minHeight: '60px'
                    }}
                  />
                  <button
                    onClick={() => {
                      // Admin response handler would go here
                      setAdminReplyText('');
                      alert('Chat response feature coming soon!');
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#0066ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      alignSelf: 'flex-end'
                    }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(0, 102, 255, 0.2)',
                borderRadius: '8px',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#8da2bb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle size={32} style={{ opacity: 0.3 }} />
                <p>Select a client to view and respond to messages</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
