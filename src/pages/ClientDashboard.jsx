import React, { useState, useEffect } from 'react';
import { Lock, Send, CheckCircle2, MessageSquare, Clock, DollarSign, User, Plus, Trash2, ToggleLeft, ToggleRight, Settings } from 'lucide-react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import { API_BASE_URL } from '../lib/api';

const ADMIN_EMAIL = 'saxs.solutions25@gmail.com';

export default function ClientDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Password setup modal states
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Available clients list (for developer admin selection)
  const [clientsList, setClientsList] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');

  // Core Synced Project States
  const [projectDetails, setProjectDetails] = useState({
    title: "",
    tier: "",
    progress: 0,
    status: "",
    cost: "",
    timeline: ""
  });

  const [milestones, setMilestones] = useState([]);

  const [invoices, setInvoices] = useState([]);

  const [messages, setMessages] = useState([]);

  const [chatInput, setChatInput] = useState('');

  // Developer Admin Controller States
  const [adminTitle, setAdminTitle] = useState('');
  const [adminTier, setAdminTier] = useState('');
  const [adminCost, setAdminCost] = useState('');
  const [adminTimeline, setAdminTimeline] = useState('');
  const [adminStatusText, setAdminStatusText] = useState('');
  
  // Custom Invoice Form States
  const [newInvTitle, setNewInvTitle] = useState('');
  const [newInvDesc, setNewInvDesc] = useState('');
  const [newInvAmount, setNewInvAmount] = useState('');
  const [newInvStatus, setNewInvStatus] = useState('PENDING');

  // 1. Firebase Authentication State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        setIsLoggedIn(true);
        
        // Exclusively check if user is saxs.solutions25@gmail.com to activate admin view
        const isUserAdmin = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        if (isUserAdmin) {
          setIsAdminView(true);
        } else {
          setIsAdminView(false);
          // Check if this is a first-time user (from inquiry) who needs to set password
          // A first-time user will have no metadata indicating password setup
          if (user.metadata && !user.metadata.lastSignInTime) {
            setShowPasswordSetup(true);
          }
        }
      } else {
        setIsLoggedIn(false);
        setEmail('');
        setIsAdminView(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Projects list for Admin Selector
  useEffect(() => {
    const fetchClients = async () => {
      if (isLoggedIn && isAdminView && auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken();
          const res = await fetch(`${API_BASE_URL}/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            const emails = data.map(p => p.clientEmail);
            const uniqueEmails = Array.from(new Set(emails));
            setClientsList(uniqueEmails);
            // Auto-select first client when list is loaded
            if (uniqueEmails.length > 0 && !selectedClient) {
              setSelectedClient(uniqueEmails[0]);
            }
          }
        } catch (error) {
          console.error('Error fetching admin client list:', error);
        }
      }
    };
    fetchClients();
  }, [isLoggedIn, isAdminView]);

  async function loadDashboardData(clientEmail) {
    if (!auth.currentUser || !clientEmail || clientEmail.trim() === '') return;
    const cleanEmail = clientEmail.toLowerCase();

    try {
      const token = await auth.currentUser.getIdToken();
      setIsLoading(true);
      
      // A. Fetch Project Metadata & Milestones from MongoDB
      const projectRes = await fetch(`${API_BASE_URL}/projects/my-project`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'X-Target-Client': cleanEmail 
        }
      });
      
      if (projectRes.ok) {
        const projectData = await projectRes.json();
        
        // Check if this is a first-time user (new project from inquiry)
        const isFirstTime = !projectData.milestones || projectData.milestones.length === 0;
        
        setProjectDetails({
          title: projectData.title,
          tier: projectData.tier,
          progress: isFirstTime ? 0 : projectData.progress,
          status: projectData.status || 'Under review',
          cost: projectData.cost,
          timeline: projectData.timeline
        });
        
        // Initialize with "inquiry submitted" for first-time users
        if (isFirstTime) {
          setMilestones([
            {
              title: 'Inquiry Submitted',
              completed: true,
              dueDate: new Date().toISOString().split('T')[0]
            },
            {
              title: 'Initial Design',
              completed: false,
              dueDate: ''
            },
            {
              title: 'Development',
              completed: false,
              dueDate: ''
            },
            {
              title: 'Testing & Refinement',
              completed: false,
              dueDate: ''
            },
            {
              title: 'Launch',
              completed: false,
              dueDate: ''
            },
            {
              title: '30-Day Support',
              completed: false,
              dueDate: ''
            }
          ]);
        } else {
          setMilestones(projectData.milestones || []);
        }

        if (isAdminView) {
          setAdminTitle(projectData.title);
          setAdminTier(projectData.tier);
          setAdminCost(projectData.cost);
          setAdminTimeline(projectData.timeline);
          setAdminStatusText(projectData.status);
        }
      }

      // B. Fetch Billing ledger from MongoDB
      let billingRes;
      if (isAdminView) {
        billingRes = await fetch(`${API_BASE_URL}/billing/client/${cleanEmail}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        billingRes = await fetch(`${API_BASE_URL}/billing/my-invoices`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'X-Target-Client': cleanEmail
          }
        });
      }

      if (billingRes.ok) {
        const billingData = await billingRes.json();
        setInvoices(billingData);
      }
    } catch (error) {
      console.error('Error loading MongoDB dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Sync Structured Project Records from MongoDB via Backend
  useEffect(() => {
    if (isLoggedIn && email) {
      // For admin: only load if selectedClient is set
      // For client: load with their email
      const activeUser = isAdminView ? selectedClient : email;
      if (activeUser && activeUser.trim().length > 0) {
        // Run after render so switching clients quickly doesn't fire stale loads.
        const timer = setTimeout(() => loadDashboardData(activeUser), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoggedIn, email, selectedClient, isAdminView]);

  // 4. Live Chat Firestore Listener Integration
  useEffect(() => {
    if (!isLoggedIn || !email) return;

    const activeChatRoom = isAdminView ? selectedClient : email;
    // Don't set up listener if we don't have a valid room name
    if (!activeChatRoom || activeChatRoom.trim().length === 0) return;

    const cleanRoom = activeChatRoom.toLowerCase();

    let unsubscribe = null;

    try {
      // Bind real-time listener to Firestore chats collection
      const messagesRef = collection(db, "chats", cleanRoom, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      unsubscribe = onSnapshot(q, (snapshot) => {
        const chatList = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          chatList.push({
            sender: data.sender,
            text: data.text,
            time: data.time || "Just now"
          });
        });
        
        if (chatList.length > 0) {
          setMessages(chatList);
        } else {
          setMessages([
            { sender: 'dev', text: `Welcome to your high-fidelity portal workspace for ${cleanRoom}. We can use this channel to discuss layout directions, specifications, and timelines.`, time: "" }
          ]);
        }
      }, (error) => {
        console.error("Firestore live chat sync error:", error);
        // Set a default welcome message if Firestore fails
        setMessages([
          { sender: 'dev', text: `Welcome to your high-fidelity portal workspace for ${cleanRoom}. We can use this channel to discuss layout directions, specifications, and timelines.`, time: "" }
        ]);
      });
    } catch (error) {
      console.error("Error setting up Firestore listener:", error);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isLoggedIn, email, selectedClient, isAdminView]);

  // Password validation function
  const validatePassword = (pwd) => {
    return pwd && pwd.length >= 6;
  };

  // Email validation function
  const validateEmail = (emailAddr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddr);
  };

  // Login handler using Firebase Authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      alert("Email address is required.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password || password.trim().length === 0) {
      alert("Password is required.");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
    } catch (err) {
      console.error("Login error:", err.message);
      alert(`Login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password setup for new users
  const handlePasswordSetup = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Update the user's password in Firebase
      await updatePassword(auth.currentUser, newPassword);
      setShowPasswordSetup(false);
      setNewPassword('');
      setConfirmPassword('');
      setPassword(newPassword); // Set the form password to the new one
    } catch (err) {
      console.error("Password update error:", err.message);
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  // CLIENT Send Chat Message to Firestore
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;
    if (!isLoggedIn || !email) return;

    const activeUser = email.toLowerCase();
    const textVal = chatInput;
    setChatInput('');

    try {
      const messagesRef = collection(db, "chats", activeUser, "messages");
      await addDoc(messagesRef, {
        sender: 'client',
        text: textVal,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp(),
        isProcessed: false // read by Node server real-time autoresponder
      });
    } catch (err) {
      console.error("Error writing chat to Firestore:", err);
    }
  };

  // DEVELOPER Send Chat Message to Firestore
  const handleDevSendMessage = async (e) => {
    e.preventDefault();
    if (chatInput.trim() === '') return;
    if (!isLoggedIn || !selectedClient) return;

    const activeUser = selectedClient.toLowerCase();
    const textVal = chatInput;
    setChatInput('');

    try {
      const messagesRef = collection(db, "chats", activeUser, "messages");
      await addDoc(messagesRef, {
        sender: 'dev',
        text: textVal,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp(),
        isProcessed: true
      });
    } catch (err) {
      console.error("Error writing dev chat to Firestore:", err);
    }
  };

  // DEVELOPER Adjust Details & Progress in MongoDB
  const handleDetailsUpdate = async (updatedFields) => {
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdToken();

    const payload = {
      clientEmail: selectedClient,
      ...projectDetails,
      ...updatedFields
    };

    try {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setProjectDetails({
          title: data.title,
          tier: data.tier,
          progress: data.progress,
          status: data.status,
          cost: data.cost,
          timeline: data.timeline
        });
      }
    } catch (err) {
      console.error("Error adjusting project details in MongoDB:", err);
    }
  };

  // DEVELOPER Adjust Milestones in MongoDB
  const handleMilestoneStatusChange = async (index, status) => {
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdToken();

    const updatedMilestones = milestones.map((m, idx) => 
      idx === index ? { ...m, status } : m
    );
    setMilestones(updatedMilestones);

    try {
      await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clientEmail: selectedClient,
          milestones: updatedMilestones
        })
      });
    } catch (err) {
      console.error("Error updating project milestones in MongoDB:", err);
    }
  };

  // DEVELOPER Add Invoice to MongoDB
  const handleAddInvoice = async (e) => {
    e.preventDefault();
    if (!newInvTitle.trim() || !newInvAmount.trim()) {
      alert("Invoice Title and Amount are required.");
      return;
    }
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdToken();

    const amountFormatted = newInvAmount.includes('ZAR') ? newInvAmount : `${newInvAmount} ZAR`;
    const invoiceId = `INV-2026-00${invoices.length + 1}`;

    try {
      const res = await fetch(`${API_BASE_URL}/billing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clientEmail: selectedClient,
          invoiceId,
          title: newInvTitle,
          desc: newInvDesc || "Project milestone completed",
          amount: amountFormatted,
          status: newInvStatus
        })
      });

      if (res.ok) {
        const newInvoice = await res.json();
        setInvoices([...invoices, newInvoice]);
        setNewInvTitle('');
        setNewInvDesc('');
        setNewInvAmount('');
        setNewInvStatus('PENDING');
      }
    } catch (err) {
      console.error("Error writing invoice to MongoDB:", err);
    }
  };

  // DEVELOPER Remove Invoice from MongoDB
  const handleRemoveInvoice = async (invoiceId) => {
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdToken();

    try {
      const res = await fetch(`${API_BASE_URL}/billing/${invoiceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setInvoices(invoices.filter(inv => inv.invoiceId !== invoiceId));
      }
    } catch (err) {
      console.error("Error deleting invoice from MongoDB:", err);
    }
  };

  // DEVELOPER Toggle Invoice Payment Status in MongoDB
  const handleToggleInvoiceStatus = async (invoiceId) => {
    if (!auth.currentUser) return;
    const token = await auth.currentUser.getIdToken();

    const invoice = invoices.find(inv => inv.invoiceId === invoiceId);
    if (!invoice) return;

    const nextStatus = invoice.status === 'PAID' ? 'PENDING' : 'PAID';

    try {
      const res = await fetch(`${API_BASE_URL}/billing/${invoiceId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setInvoices(invoices.map(inv => 
          inv.invoiceId === invoiceId ? { ...inv, status: nextStatus } : inv
        ));
      }
    } catch (err) {
      console.error("Error toggling invoice status in MongoDB:", err);
    }
  };

  // Password setup modal for first-time users
  if (isLoggedIn && showPasswordSetup && !isAdminView) {
    return (
      <div className="login-container fade-in container section-padding" style={{ maxWidth: '480px' }}>
        <div className="glass-card" style={{ padding: '3rem 2.5rem', border: '2px solid var(--primary-glow)', boxShadow: 'var(--card-shadow-hover)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ margin: '0 auto 1rem', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 102, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--primary-glow)' }}>
              <Lock size={24} style={{ color: 'var(--primary-glow)' }} />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Set Your Password</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complete your account setup before accessing the dashboard</p>
          </div>

          <form onSubmit={handlePasswordSetup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>New Password</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-pure)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Confirm Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-pure)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {passwordError && (
              <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'rgba(255, 69, 69, 0.1)', border: '1px solid rgba(255, 69, 69, 0.3)', color: '#ff4545', fontSize: '0.85rem', fontWeight: 600 }}>
                {passwordError}
              </div>
            )}

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ✓ Must be at least 6 characters
            </p>

            <button
              type="submit"
              disabled={isLoading}
              style={{ 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                background: 'var(--primary-glow)', 
                color: 'var(--bg-pure)', 
                border: 'none', 
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? 'Setting Password...' : 'Set Password & Continue'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.5rem' }}>
            Logged in as: <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{email}</span>
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="login-container fade-in container section-padding" style={{ maxWidth: '480px' }}>
        <div className="glass-card" style={{ padding: '3rem 2.5rem', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ margin: '0 auto 1rem', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 102, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)' }}>
              <Lock size={24} style={{ color: 'var(--primary-glow)' }} />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Client Portal</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Secure project tracking & developer collaboration</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none' }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Password</label>
              <input 
                type="password" 
                placeholder="" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none' }}
              />
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Password must be at least 6 characters</p>
            </div>

            <button type="submit" disabled={isLoading} className="neon-glow-btn" style={{ justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
              {isLoading ? "Authenticating..." : "Access Portal"}
            </button>
          </form>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0, 102, 255, 0.02)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0' }}>💡 Login with your registered email and secure password. Your project details and invoices will load automatically.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in container section-padding" style={{ position: 'relative' }}>
      
      {/* Developer View Toggle Trigger (Exclusive for saxs.solutions25@gmail.com) */}
      {email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setIsAdminView(!isAdminView)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: isAdminView ? 'linear-gradient(135deg, #FF3366, #FF0055)' : 'var(--bg-deep)',
              color: isAdminView ? '#FFF' : 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: isAdminView ? '0 4px 15px rgba(255, 51, 102, 0.2)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <Settings size={14} className={isAdminView ? "spin-animation" : ""} />
            {isAdminView ? "Switch to Client Dashboard View" : "Access Developer Admin View"}
            {isAdminView ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
        </div>
      )}

      {/* ========================================================
          DEVELOPER ADMIN CONTROL PANEL
          ======================================================== */}
      {isAdminView && (
        <div className="glass-card fade-in" style={{
          border: '2px solid #FF3366',
          boxShadow: '0 8px 30px rgba(255, 51, 102, 0.1)',
          background: 'rgba(20, 10, 15, 0.02)',
          padding: '2rem',
          borderRadius: '16px',
          marginBottom: '3rem'
        }}>
          <h3 style={{ color: '#FF3366', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🛠️ Developer Admin Control Console
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            
            {/* Admin Column 1: Client Selector & Scope Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#FF3366', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Select Client Workspace to Modify
                </label>
                <select 
                  value={selectedClient} 
                  onChange={(e) => setSelectedClient(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem 0.75rem', borderRadius: '6px', outline: 'none', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  {clientsList.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Project Title</label>
                <input 
                  type="text" 
                  value={adminTitle} 
                  onChange={(e) => { setAdminTitle(e.target.value); handleDetailsUpdate({ title: e.target.value }); }}
                  style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Service Tier / Scope Details</label>
                <input 
                  type="text" 
                  value={adminTier} 
                  onChange={(e) => { setAdminTier(e.target.value); handleDetailsUpdate({ tier: e.target.value }); }}
                  style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Cost</label>
                  <input 
                    type="text" 
                    value={adminCost} 
                    onChange={(e) => { setAdminCost(e.target.value); handleDetailsUpdate({ cost: e.target.value }); }}
                    style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Timeline</label>
                  <input 
                    type="text" 
                    value={adminTimeline} 
                    onChange={(e) => { setAdminTimeline(e.target.value); handleDetailsUpdate({ timeline: e.target.value }); }}
                    style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Admin Column 2: Progress Slider & Status Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#FF3366', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Adjust Progress Meter ({projectDetails.progress}%)
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={projectDetails.progress}
                  onChange={(e) => handleDetailsUpdate({ progress: parseInt(e.target.value, 10) })}
                  style={{ width: '100%', accentColor: '#FF3366', height: '6px', borderRadius: '3px', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Active Status Message</label>
                <textarea 
                  rows="3"
                  value={adminStatusText} 
                  onChange={(e) => { setAdminStatusText(e.target.value); handleDetailsUpdate({ status: e.target.value }); }}
                  style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>

              {/* Milestone Selectors */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Milestones Statuses:</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '140px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {milestones.map((m, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '160px' }}>{m.name}</span>
                      <select 
                        value={m.status} 
                        onChange={(e) => handleMilestoneStatusChange(idx, e.target.value)}
                        style={{ background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.1rem 0.25rem', borderRadius: '4px', fontSize: '0.7rem' }}
                      >
                        <option value="completed">Completed</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Column 3: Add Invoice Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#FF3366', textTransform: 'uppercase' }}>
                Add Billing Invoice
              </label>
              
              <form onSubmit={handleAddInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <input 
                  type="text" 
                  placeholder="e.g. Initial 50% Deposit"
                  value={newInvTitle}
                  onChange={(e) => setNewInvTitle(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}
                />
                <input 
                  type="text" 
                  placeholder="e.g. Scope signed & initiated"
                  value={newInvDesc}
                  onChange={(e) => setNewInvDesc(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}
                />
                <input 
                  type="text" 
                  placeholder="Amount: R1,500"
                  value={newInvAmount}
                  onChange={(e) => setNewInvAmount(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}
                />
                <select 
                  value={newInvStatus} 
                  onChange={(e) => setNewInvStatus(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem' }}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="PENDING RELEASE">PENDING RELEASE</option>
                </select>
                <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', background: '#FF3366', color: '#FFF', border: 'none', padding: '0.5rem', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>
                  <Plus size={12} /> Add Billing Item
                </button>
              </form>
            </div>

          </div>

          {/* Active invoice manager lists in admin */}
          {invoices.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Modify Invoice Statuses / Remove:</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {invoices.map((inv, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{inv.title}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{inv.amount} • {inv.status}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        onClick={() => handleToggleInvoiceStatus(inv.invoiceId)}
                        style={{ background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.65rem', padding: '0.2rem 0.4rem', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Status
                      </button>
                      <button 
                        onClick={() => handleRemoveInvoice(inv.invoiceId)}
                        style={{ background: 'transparent', border: 'none', color: '#FF3366', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          CORE DASHBOARD LAYOUT (CLIENT VIEW) - ONLY SHOW WHEN NOT IN ADMIN VIEW
          ======================================================== */}
      {!isAdminView && (
        <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="tech-badge" style={{ marginBottom: '0.5rem' }}>Operational Workspace</span>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>{projectDetails.title}</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Scope: {projectDetails.tier} | Cost: {projectDetails.cost} | Timeline: {projectDetails.timeline}</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-deep)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', alignItems: 'center' }}>
            <User size={16} style={{ color: 'var(--primary-glow)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{isAdminView ? `${selectedClient} (Developer Control)` : email}</span>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="neon-outline-btn"
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '8px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {/* Left Column: Progress & Milestones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Progress Tracker Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} style={{ color: 'var(--primary-glow)' }} /> Build Progress Meter
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
              <span>Development Phase</span>
              <span style={{ color: 'var(--primary-glow)' }}>{projectDetails.progress}%</span>
            </div>
            
            <div style={{ width: '100%', background: 'var(--bg-deep)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{ width: `${projectDetails.progress}%`, background: 'linear-gradient(90deg, var(--primary-glow), var(--primary-neon))', height: '100%', borderRadius: '5px', boxShadow: '0 2px 10px rgba(0, 102, 255, 0.15)' }}></div>
            </div>

            <div style={{ padding: '0.875rem', background: 'rgba(0, 102, 255, 0.02)', border: '1px solid rgba(0, 102, 255, 0.1)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Status:</strong> {projectDetails.status}
            </div>
          </div>

          {/* Milestones Checkbox Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} style={{ color: 'var(--primary-glow)' }} /> Project Milestones
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {milestones.map((m, idx) => {
                const isDone = m.status === 'completed';
                const isActive = m.status === 'active';
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: isDone ? 0.75 : 1 }}>
                    <div 
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '4px', 
                        border: isDone ? 'none' : isActive ? '2px solid var(--primary-glow)' : '2px solid var(--border-color)',
                        background: isDone ? 'var(--primary-glow)' : 'transparent',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#FFFFFF'
                      }}
                    >
                      {isDone && <CheckCircle2 size={16} color="#FFFFFF" fill="var(--primary-glow)" />}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary-glow)' : 'var(--text-secondary)' }}>
                      {m.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Invoicing & Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Billing Ledger Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={18} style={{ color: 'var(--secondary-glow)' }} /> Billing & Deposits (50/50 Split)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {invoices.map((inv, idx) => {
                const isPaid = inv.status === 'PAID';
                const isPendingRelease = inv.status === 'PENDING RELEASE';
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-deep)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{inv.title}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{inv.desc} • {inv.amount}</p>
                    </div>
                    <span className="tech-badge" style={{ 
                      background: isPaid ? 'rgba(0, 102, 255, 0.08)' : isPendingRelease ? 'rgba(255, 176, 32, 0.08)' : 'rgba(0, 0, 0, 0.03)', 
                      color: isPaid ? 'var(--primary-glow)' : isPendingRelease ? '#FFB020' : 'var(--text-secondary)', 
                      border: isPaid ? '1px solid rgba(0, 102, 255, 0.15)' : isPendingRelease ? '1px solid rgba(255, 176, 32, 0.2)' : '1px solid var(--border-color)',
                      fontSize: '0.65rem'
                    }}>
                      {inv.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Messenger Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '360px', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} style={{ color: 'var(--primary-glow)' }} /> Live Developer Communication
            </h3>

            {/* Message Feed */}
            <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0', marginBottom: '1rem' }}>
              {messages.map((msg, i) => {
                const isDev = msg.sender === 'dev' || msg.sender === 'support';
                return (
                  <div key={i} style={{ alignSelf: isDev ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                    <div 
                      style={{ 
                        background: isDev ? 'var(--bg-deep)' : 'rgba(0, 102, 255, 0.05)', 
                        border: isDev ? '1px solid var(--border-color)' : '1px solid var(--primary-glow)', 
                        padding: '0.75rem 1rem', 
                        borderRadius: '12px',
                        borderBottomLeftRadius: isDev ? '0px' : '12px',
                        borderBottomRightRadius: isDev ? '12px' : '0px',
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {msg.text}
                    </div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: isDev ? 'left' : 'right', marginTop: '0.25rem' }}>{msg.time}</p>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={isAdminView ? handleDevSendMessage : handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder={isAdminView ? "Send message as developer..." : "Ask developer for an update..."} 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{ flexGrow: 1, background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.875rem', borderRadius: '8px', outline: 'none', fontSize: '0.85rem' }}
              />
              <button type="submit" className="neon-glow-btn" style={{ padding: '0.6rem 1rem' }}>
                <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      </div>
      
      <style>{`
        .spin-animation {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </>
      )}

    </div>
  );
}
