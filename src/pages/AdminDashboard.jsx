import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { 
  fetchLeads, 
  updateLeadStatus, 
  deleteLead 
} from '../utils/firebaseHelper';
import {
  fetchAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  toggleBlogPublish,
  deleteBlogPost,
  uploadBlogImage
} from '../utils/blogHelper';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('blisstown_admin_authenticated') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab State: 'contacts' | 'newsletters' | 'blogs'
  const [activeTab, setActiveTab] = useState('contacts');
  
  // Leads Data States
  const [contactLeads, setContactLeads] = useState([]);
  const [newsletterLeads, setNewsletterLeads] = useState([]);

  // Blog States
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogForm, setBlogForm] = useState({
    title: '', excerpt: '', content: '', author: 'Bliss Town Team',
    coverImage: '', tags: '', published: false
  });
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [blogSaving, setBlogSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const contentRef = useRef(null);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // UI Notifications
  const [toastMessage, setToastMessage] = useState(null);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const contacts = await fetchLeads('contacts');
      const newsletters = await fetchLeads('newsletters');
      const blogs = await fetchAllBlogPosts();
      setContactLeads(contacts);
      setNewsletterLeads(newsletters);
      setBlogPosts(blogs);
    } catch (error) {
      console.error('Error fetching leads from Firebase:', error);
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password);
      sessionStorage.setItem('blisstown_admin_authenticated', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      triggerToast('Access granted. Welcome back, Admin.');
    } catch (error) {
      console.error('Authentication failed:', error);
      setLoginError('Invalid email or password. Please verify and try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('blisstown_admin_authenticated');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setShowBlogEditor(false);
    setEditingBlogId(null);
    triggerToast('Logged out of admin ledger.');
  };

  // Clear all data for active tab
  const handleClearAllData = async () => {
    if (activeTab === 'blogs') {
      triggerToast('Use individual delete buttons to remove blog posts.');
      return;
    }
    const colName = activeTab === 'contacts' ? 'contacts' : 'newsletters';
    const typeLabel = activeTab === 'contacts' ? 'contact inquiries' : 'newsletter subscribers';
    
    if (window.confirm(`Are you sure you want to purge all ${typeLabel} from Firestore? This cannot be undone.`)) {
      triggerToast(`Purging ${typeLabel} database...`);
      try {
        const listToClear = activeTab === 'contacts' ? contactLeads : newsletterLeads;
        for (const lead of listToClear) {
          await deleteLead(colName, lead.id);
        }
        loadAllData();
        triggerToast(`All ${typeLabel} records purged from Firestore`);
      } catch (error) {
        console.error('Error purging data:', error);
        triggerToast('Failed to purge data');
      }
    }
  };

  // Contact Lead Handlers
  const handleContactStatusChange = async (id, newStatus) => {
    try {
      await updateLeadStatus('contacts', id, newStatus);
      loadAllData();
      triggerToast(`Inquiry status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const handleContactDelete = async (id) => {
    if (window.confirm('Delete this contact inquiry permanently?')) {
      try {
        await deleteLead('contacts', id);
        loadAllData();
        triggerToast('Inquiry lead deleted');
      } catch (error) {
        console.error('Error deleting contact lead:', error);
      }
    }
  };

  // Newsletter Lead Handlers
  const handleNewsletterStatusChange = async (id, newStatus) => {
    try {
      await updateLeadStatus('newsletters', id, newStatus);
      loadAllData();
      triggerToast(`Subscriber status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating subscriber status:', error);
    }
  };

  const handleNewsletterDelete = async (id) => {
    if (window.confirm('Remove this newsletter subscriber permanently?')) {
      try {
        await deleteLead('newsletters', id);
        loadAllData();
        triggerToast('Subscriber email removed');
      } catch (error) {
        console.error('Error deleting subscriber:', error);
      }
    }
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    let headers = [];
    let rows = [];
    let filename = '';

    if (activeTab === 'contacts') {
      headers = ['ID', 'Date Submitted', 'Name', 'Email', 'Subject', 'Message', 'Status'];
      rows = contactLeads.map(l => [
        l.id,
        new Date(l.date).toLocaleString(),
        l.name,
        l.email,
        l.subject,
        l.message.replace(/"/g, '""'),
        l.status
      ]);
      filename = 'blisstown_contact_inquiries.csv';
    } else {
      headers = ['ID', 'Date Joined', 'Email', 'Status'];
      rows = newsletterLeads.map(l => [
        l.id,
        new Date(l.date).toLocaleString(),
        l.email,
        l.status
      ]);
      filename = 'blisstown_newsletter_subscribers.csv';
    }

    // Compile CSV Content
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    triggerToast(`Exported ${activeTab} data to CSV`);
  };

  // Blog Handlers
  const handleBlogFormChange = (field, value) => {
    setBlogForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBlogSave = async (publish) => {
    if (!blogForm.title.trim()) { triggerToast('Blog title is required.'); return; }
    setBlogSaving(true);
    try {
      const payload = {
        ...blogForm,
        tags: blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        published: publish
      };
      if (editingBlogId) {
        await updateBlogPost(editingBlogId, payload);
        triggerToast(publish ? 'Post updated & published.' : 'Draft saved.');
      } else {
        await createBlogPost(payload);
        triggerToast(publish ? 'Post published to website!' : 'Draft saved successfully.');
      }
      setShowBlogEditor(false);
      setEditingBlogId(null);
      setBlogForm({ title: '', excerpt: '', content: '', author: 'Bliss Town Team', coverImage: '', tags: '', published: false });
      loadAllData();
    } catch (err) {
      console.error('Error saving blog:', err);
      const msg = err?.code === 'permission-denied'
        ? 'Firestore permission denied — update your security rules to allow writes to the "blogs" collection.'
        : `Failed to save: ${err?.message || 'Unknown error'}`;
      triggerToast(msg);
    } finally {
      setBlogSaving(false);
    }
  };

  const handleBlogEdit = (post) => {
    setEditingBlogId(post.id);
    setBlogForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || 'Bliss Town Team',
      coverImage: post.coverImage || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
      published: post.published || false
    });
    setShowBlogEditor(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBlogTogglePublish = async (post) => {
    try {
      await toggleBlogPublish(post.id, post.published);
      triggerToast(post.published ? 'Post unpublished (now draft).' : 'Post published to website!');
      loadAllData();
    } catch (err) {
      console.error('Error toggling publish:', err);
      triggerToast('Failed to update publish status.');
    }
  };

  const handleBlogDelete = async (id) => {
    if (window.confirm('Delete this blog post permanently? This cannot be undone.')) {
      try {
        await deleteBlogPost(id);
        triggerToast('Blog post deleted.');
        loadAllData();
      } catch (err) {
        console.error('Error deleting post:', err);
        triggerToast('Failed to delete post.');
      }
    }
  };

  // Apply HTML formatting around selected text in content editor
  const applyFormat = (tag, attrs = '') => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    const before = ta.value.substring(0, start);
    const after = ta.value.substring(end);
    let replacement = '';
    if (tag === 'a') {
      const href = window.prompt('Enter link URL:');
      if (!href) return;
      replacement = `<a href="${href}" target="_blank" rel="noopener">${selected || 'Link text'}</a>`;
    } else if (tag === 'ul') {
      replacement = `<ul>\n  <li>${selected || 'List item'}</li>\n</ul>`;
    } else if (tag === 'ol') {
      replacement = `<ol>\n  <li>${selected || 'List item'}</li>\n</ol>`;
    } else if (tag === 'img') {
      const src = window.prompt('Enter image URL:');
      if (!src) return;
      const alt = window.prompt('Enter alt text (optional):') || '';
      replacement = `<img src="${src}" alt="${alt}" style="max-width:100%;border-radius:8px;margin:16px 0;" />`;
    } else if (tag === 'hr') {
      replacement = `\n<hr />\n`;
    } else if (tag === 'p') {
      replacement = `\n<p>${selected || 'Paragraph text'}</p>\n`;
    } else if (tag === 'h2' || tag === 'h3') {
      replacement = `\n<${tag}>${selected || (tag === 'h2' ? 'Heading 2' : 'Heading 3')}</${tag}>\n`;
    } else if (tag === 'blockquote') {
      replacement = `\n<blockquote>${selected || 'Blockquote text'}</blockquote>\n`;
    } else {
      replacement = `<${tag}${attrs ? ' ' + attrs : ''}>${selected}</${tag}>`;
    }
    const newContent = before + replacement + after;
    handleBlogFormChange('content', newContent);
    setTimeout(() => {
      ta.focus();
      const cursor = start + replacement.length;
      ta.selectionStart = cursor;
      ta.selectionEnd = cursor;
    }, 0);
  };

  // Upload cover image file to Firebase Storage
  const uploadCoverImage = async (file) => {
    if (!file) return;
    setImageUploading(true);
    try {
      const url = await uploadBlogImage(file);
      handleBlogFormChange('coverImage', url);
      triggerToast('Cover image uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      triggerToast('Image upload failed. Check Firebase Storage rules.');
    } finally {
      setImageUploading(false);
    }
  };

  // Helper to format Date
  const formatDate = (isoString) => {
    try {
      const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(isoString).toLocaleDateString('en-US', options);
    } catch (e) {
      return 'N/A';
    }
  };

  // Dynamic statistics calculations
  const stats = {
    totalContacts: contactLeads.length,
    newContacts: contactLeads.filter(l => l.status === 'New').length,
    totalNewsletters: newsletterLeads.length,
    totalBlogs: blogPosts.length,
    publishedBlogs: blogPosts.filter(p => p.published).length,
  };

  // Filter & Search Logic
  const getFilteredContacts = () => {
    return contactLeads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.message.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const getFilteredNewsletters = () => {
    return newsletterLeads.filter(lead => {
      const matchesSearch = lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard-page login-page-layout">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="admin-toast glass-panel">
            <span className="material-symbols-outlined toast-icon">info</span>
            <span className="toast-text">{toastMessage}</span>
          </div>
        )}

        <div className="login-container glass-panel-heavy">
          <div className="login-logo-block">
            <img src="/logo.png" alt="Blisstown Logo" className="login-logo-img" />
            <span className="login-logo-subtitle">Secure Access Portal</span>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {loginError && (
              <div className="login-error-message">
                <span className="material-symbols-outlined error-icon">warning</span>
                <span>{loginError}</span>
              </div>
            )}

            <div className="login-form-group">
              <label className="font-label-sm login-label" htmlFor="login-username">Admin Email</label>
              <input
                type="email"
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ENTER ADMIN EMAIL"
                required
                className="login-input"
              />
            </div>

            <div className="login-form-group">
              <label className="font-label-sm login-label" htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER PASSWORD"
                required
                className="login-input"
              />
            </div>

            <button type="submit" className="btn-gold-border login-submit-btn">
              Authenticate
            </button>
          </form>

          <div className="login-footer">
            <button className="login-back-btn" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined">arrow_back</span> Return to Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="admin-toast glass-panel">
          <span className="material-symbols-outlined toast-icon">info</span>
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}

      {/* Admin Navigation Header */}
      <header className="admin-nav-header">
        <div className="admin-nav-container">
          <div className="admin-logo-block">
            <img src="/logo.png" alt="Blisstown Logo" className="admin-logo-img" />
            <span className="admin-logo-text">Ledger</span>
          </div>

          <div className="admin-header-actions">
            <button className="btn-secondary admin-header-btn purge-btn" onClick={handleClearAllData}>
              <span className="material-symbols-outlined">delete_sweep</span> Purge All
            </button>
            <button className="btn-gold-border admin-home-btn" onClick={() => { handleLogout(); navigate('/'); }}>
              <span className="material-symbols-outlined">home</span> PUBLIC SITE
            </button>
            <button className="btn-secondary admin-header-btn purge-btn" onClick={handleLogout} style={{ color: 'var(--on-surface-variant)', borderBottomColor: 'transparent' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>logout</span> LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Wrapper */}
      <main className="admin-main container">
        
        {/* Live Performance Stats Banner */}
        <section className="admin-stats-grid">
          <div className="admin-stat-card glass-panel">
            <div className="stat-card-header">
              <span className="font-label-sm stat-label">Total Inquiries</span>
              <span className="material-symbols-outlined stat-icon">chat</span>
            </div>
            <div className="stat-card-value font-headline-lg">
              {stats.totalContacts}
            </div>
            <div className="stat-card-footer">
              <span className="stat-subtext font-label-sm">
                RECORDS IN LEDGER
              </span>
            </div>
          </div>

          <div className="admin-stat-card glass-panel">
            <div className="stat-card-header">
              <span className="font-label-sm stat-label">New Queries</span>
              <span className="material-symbols-outlined stat-icon">mark_chat_unread</span>
            </div>
            <div className="stat-card-value font-headline-lg">
              {stats.newContacts}
            </div>
            <div className="stat-card-footer">
              <span className="stat-subtext font-label-sm">
                <strong className="status-badge new">{stats.newContacts}</strong> ACTION REQUIRED
              </span>
            </div>
          </div>

          <div className="admin-stat-card glass-panel">
            <div className="stat-card-header">
              <span className="font-label-sm stat-label">Newsletter Subscribers</span>
              <span className="material-symbols-outlined stat-icon">mail</span>
            </div>
            <div className="stat-card-value font-headline-lg">
              {stats.totalNewsletters}
            </div>
            <div className="stat-card-footer">
              <span className="stat-subtext font-label-sm">
                ACTIVE MEMBERS
              </span>
            </div>
          </div>

          <div className="admin-stat-card glass-panel">
            <div className="stat-card-header">
              <span className="font-label-sm stat-label">Blog Posts</span>
              <span className="material-symbols-outlined stat-icon">article</span>
            </div>
            <div className="stat-card-value font-headline-lg">
              {stats.totalBlogs}
            </div>
            <div className="stat-card-footer">
              <span className="stat-subtext font-label-sm">
                <strong className="status-badge new">{stats.publishedBlogs}</strong> PUBLISHED
              </span>
            </div>
          </div>
        </section>

        {/* Lead Management Section */}
        <section className="admin-leads-section glass-panel">
          
          {/* Tab Selection Row */}
          <div className="admin-tabs-row">
            <div className="admin-tabs">
              <button 
                className={`admin-tab-btn font-label-sm ${activeTab === 'contacts' ? 'active' : ''}`}
                onClick={() => { setActiveTab('contacts'); setSearchQuery(''); setStatusFilter('All'); }}
              >
                Contact Queries <span className="tab-count-badge">{stats.totalContacts}</span>
              </button>
              <button 
                className={`admin-tab-btn font-label-sm ${activeTab === 'newsletters' ? 'active' : ''}`}
                onClick={() => { setActiveTab('newsletters'); setSearchQuery(''); setStatusFilter('All'); }}
              >
                Newsletter Signups <span className="tab-count-badge">{stats.totalNewsletters}</span>
              </button>
              <button
                className={`admin-tab-btn font-label-sm ${activeTab === 'blogs' ? 'active' : ''}`}
                onClick={() => { setActiveTab('blogs'); setSearchQuery(''); setStatusFilter('All'); setShowBlogEditor(false); setEditingBlogId(null); }}
              >
                Blog Posts <span className="tab-count-badge">{stats.totalBlogs}</span>
              </button>
            </div>

            <div className="admin-tab-actions">
              {activeTab !== 'blogs' && (
                <button className="btn-gold-border export-csv-btn" onClick={handleExportCSV}>
                  <span className="material-symbols-outlined">download</span> EXPORT CSV
                </button>
              )}
              {activeTab === 'blogs' && (
                <button
                  className="btn-gold-border export-csv-btn"
                  onClick={() => { setShowBlogEditor(true); setEditingBlogId(null); setBlogForm({ title: '', excerpt: '', content: '', author: 'Bliss Town Team', coverImage: '', category: 'General', tags: '', published: false }); }}
                >
                  <span className="material-symbols-outlined">add</span> NEW POST
                </button>
              )}
            </div>
          </div>

          {/* Filtering and Search Area */}
          <div className="admin-filters-row">
            <div className="search-bar-container">
              <span className="material-symbols-outlined search-icon">search</span>
              <input
                type="text"
                className="admin-search-input"
                placeholder={
                  activeTab === 'contacts' ? 'Search name, email, subject, message...' : 'Search subscriber email...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filters-group">
              {/* Status Filter */}
              <div className="filter-item">
                <label className="font-label-sm filter-label">Status</label>
                <select 
                  className="admin-filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  {activeTab === 'contacts' ? (
                    <>
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Archived">Archived</option>
                    </>
                  ) : (
                    <>
                      <option value="Active">Active</option>
                      <option value="Unsubscribed">Unsubscribed</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="admin-table-container">
            
            {/* Contact Queries Table */}
            {activeTab === 'contacts' && (
              <>
                {getFilteredContacts().length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th className="font-label-sm text-left">Date / ID</th>
                        <th className="font-label-sm text-left">Sender Details</th>
                        <th className="font-label-sm text-left">Subject</th>
                        <th className="font-label-sm text-left">Detailed Request Message</th>
                        <th className="font-label-sm text-left">Status</th>
                        <th className="font-label-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredContacts().map(lead => (
                        <tr key={lead.id} className="admin-table-row">
                          <td>
                            <div className="table-cell-date">{formatDate(lead.date)}</div>
                            <div className="table-cell-id">{lead.id}</div>
                          </td>
                          <td>
                            <div className="table-cell-name">{lead.name}</div>
                            <div className="table-cell-contact-info">
                              <span><span className="material-symbols-outlined small-icon">mail</span> {lead.email}</span>
                            </div>
                          </td>
                          <td>
                            <div className="table-cell-subject">{lead.subject}</div>
                          </td>
                          <td>
                            <div className="table-cell-message-text">{lead.message}</div>
                          </td>
                          <td>
                            <select 
                              className={`status-selector-dropdown ${lead.status.replace(/\s+/g, '-').toLowerCase()}`}
                              value={lead.status}
                              onChange={(e) => handleContactStatusChange(lead.id, e.target.value)}
                            >
                              <option value="New">New</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </td>
                          <td>
                            <div className="table-actions-cell">
                              <button 
                                className="table-action-icon-btn delete" 
                                title="Delete Record"
                                onClick={() => handleContactDelete(lead.id)}
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="table-empty-state">
                    <span className="material-symbols-outlined empty-icon">mark_chat_unread</span>
                    <h4 className="empty-heading font-headline-md">No Inquiries Found</h4>
                    <p className="empty-desc font-body-md">There are no contact inquiries matching your search criteria.</p>
                  </div>
                )}
              </>
            )}

            {/* Blog Posts Management */}
            {activeTab === 'blogs' && (
              <>
                {/* Blog Editor Panel */}
                {showBlogEditor && (
                  <div className="blog-editor-panel">
                    <h3 className="blog-editor-heading">
                      <span className="material-symbols-outlined">edit_note</span>
                      {editingBlogId ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </h3>

                    <div className="blog-editor-grid">
                      <div className="blog-editor-field">
                        <label className="font-label-sm blog-editor-label">Post Title *</label>
                        <input
                          className="blog-editor-input"
                          type="text"
                          placeholder="Enter a compelling title..."
                          value={blogForm.title}
                          onChange={e => handleBlogFormChange('title', e.target.value)}
                        />
                      </div>

                      <div className="blog-editor-field">
                        <label className="font-label-sm blog-editor-label">Author</label>
                        <input
                          className="blog-editor-input"
                          type="text"
                          placeholder="Author name"
                          value={blogForm.author}
                          onChange={e => handleBlogFormChange('author', e.target.value)}
                        />
                      </div>


                      <div className="blog-editor-field blog-editor-field--cover">
                        <label className="font-label-sm blog-editor-label">Banner / Cover Image</label>
                        <div className="cover-image-inputs">
                          <input
                            className="blog-editor-input"
                            type="url"
                            placeholder="Paste image URL — https://..."
                            value={blogForm.coverImage}
                            onChange={e => handleBlogFormChange('coverImage', e.target.value)}
                          />
                          <span className="cover-image-or">or</span>
                          <label className={`cover-upload-btn ${imageUploading ? 'uploading' : ''}`}>
                            <span className="material-symbols-outlined">{imageUploading ? 'hourglass_top' : 'upload'}</span>
                            {imageUploading ? 'Uploading…' : 'Upload File'}
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={e => uploadCoverImage(e.target.files[0])}
                              disabled={imageUploading}
                            />
                          </label>
                        </div>
                        {blogForm.coverImage && (
                          <div className="cover-image-preview">
                            <img src={blogForm.coverImage} alt="Cover preview" />
                            <button className="cover-remove-btn" onClick={() => handleBlogFormChange('coverImage', '')}>
                              <span className="material-symbols-outlined">close</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="blog-editor-field blog-editor-field--full">
                        <label className="font-label-sm blog-editor-label">Excerpt / Summary</label>
                        <textarea
                          className="blog-editor-input blog-editor-textarea"
                          rows={3}
                          placeholder="A brief description shown on the blog listing page..."
                          value={blogForm.excerpt}
                          onChange={e => handleBlogFormChange('excerpt', e.target.value)}
                        />
                      </div>

                      <div className="blog-editor-field blog-editor-field--full">
                        <label className="font-label-sm blog-editor-label">Content</label>
                        {/* Rich Text Toolbar */}
                        <div className="rte-toolbar">
                          <div className="rte-toolbar-group">
                            <button type="button" className="rte-btn" title="Bold" onClick={() => applyFormat('strong')}><b>B</b></button>
                            <button type="button" className="rte-btn" title="Italic" onClick={() => applyFormat('em')}><i>I</i></button>
                            <button type="button" className="rte-btn" title="Underline" onClick={() => applyFormat('u')}><u>U</u></button>
                            <button type="button" className="rte-btn" title="Strikethrough" onClick={() => applyFormat('s')}><s>S</s></button>
                          </div>
                          <div className="rte-toolbar-divider" />
                          <div className="rte-toolbar-group">
                            <button type="button" className="rte-btn rte-btn--label" title="Heading 2" onClick={() => applyFormat('h2')}>H2</button>
                            <button type="button" className="rte-btn rte-btn--label" title="Heading 3" onClick={() => applyFormat('h3')}>H3</button>
                            <button type="button" className="rte-btn rte-btn--label" title="Paragraph" onClick={() => applyFormat('p')}>P</button>
                          </div>
                          <div className="rte-toolbar-divider" />
                          <div className="rte-toolbar-group">
                            <button type="button" className="rte-btn" title="Bullet List" onClick={() => applyFormat('ul')}>
                              <span className="material-symbols-outlined">format_list_bulleted</span>
                            </button>
                            <button type="button" className="rte-btn" title="Numbered List" onClick={() => applyFormat('ol')}>
                              <span className="material-symbols-outlined">format_list_numbered</span>
                            </button>
                            <button type="button" className="rte-btn" title="Blockquote" onClick={() => applyFormat('blockquote')}>
                              <span className="material-symbols-outlined">format_quote</span>
                            </button>
                          </div>
                          <div className="rte-toolbar-divider" />
                          <div className="rte-toolbar-group">
                            <button type="button" className="rte-btn" title="Link" onClick={() => applyFormat('a')}>
                              <span className="material-symbols-outlined">link</span>
                            </button>
                            <button type="button" className="rte-btn" title="Insert Image" onClick={() => applyFormat('img')}>
                              <span className="material-symbols-outlined">image</span>
                            </button>
                            <button type="button" className="rte-btn" title="Divider" onClick={() => applyFormat('hr')}>
                              <span className="material-symbols-outlined">horizontal_rule</span>
                            </button>
                          </div>
                        </div>
                        <textarea
                          ref={contentRef}
                          id="blog-content-editor"
                          className="blog-editor-input blog-editor-textarea blog-editor-content-area"
                          rows={18}
                          placeholder="Write your content here. Select text then click a toolbar button to format it."
                          value={blogForm.content}
                          onChange={e => handleBlogFormChange('content', e.target.value)}
                        />
                      </div>

                      <div className="blog-editor-field blog-editor-field--full">
                        <label className="font-label-sm blog-editor-label">Tags (comma-separated)</label>
                        <input
                          className="blog-editor-input"
                          type="text"
                          placeholder="luxury, real estate, noida, investment..."
                          value={blogForm.tags}
                          onChange={e => handleBlogFormChange('tags', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="blog-editor-actions">
                      <button
                        className="btn-secondary admin-header-btn"
                        onClick={() => { setShowBlogEditor(false); setEditingBlogId(null); }}
                        disabled={blogSaving}
                      >
                        <span className="material-symbols-outlined">close</span> Cancel
                      </button>
                      <button
                        className="btn-gold-border export-csv-btn"
                        onClick={() => handleBlogSave(false)}
                        disabled={blogSaving}
                      >
                        <span className="material-symbols-outlined">save</span>
                        {blogSaving ? 'Saving...' : 'Save as Draft'}
                      </button>
                      <button
                        className="btn-gold-border export-csv-btn blog-publish-btn"
                        onClick={() => handleBlogSave(true)}
                        disabled={blogSaving}
                      >
                        <span className="material-symbols-outlined">publish</span>
                        {blogSaving ? 'Publishing...' : 'Publish Now'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Blog Posts List */}
                {blogPosts.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th className="font-label-sm text-left">Date</th>
                        <th className="font-label-sm text-left">Title</th>
                        <th className="font-label-sm text-left">Author</th>
                        <th className="font-label-sm text-left">Status</th>
                        <th className="font-label-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.map(post => (
                        <tr key={post.id} className="admin-table-row">
                          <td>
                            <div className="table-cell-date">{formatDate(post.createdAt)}</div>
                          </td>
                          <td>
                            <div className="table-cell-name" style={{ maxWidth: '240px' }}>{post.title}</div>
                            {post.excerpt && <div className="table-cell-id" style={{ maxWidth: '240px', whiteSpace: 'normal', marginTop: '4px' }}>{post.excerpt.slice(0, 80)}…</div>}
                          </td>
                          <td>
                            <div className="table-cell-subject">{post.author}</div>
                          </td>
                          <td>
                            <span className={`status-badge ${post.published ? 'in-progress' : 'archived'}`}
                              style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 600 }}>
                              {post.published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions-cell">
                              <button
                                className="table-action-icon-btn"
                                title={post.published ? 'Unpublish' : 'Publish'}
                                onClick={() => handleBlogTogglePublish(post)}
                                style={{ color: post.published ? 'var(--secondary)' : 'var(--on-surface-variant)' }}
                              >
                                <span className="material-symbols-outlined">{post.published ? 'unpublished' : 'publish'}</span>
                              </button>
                              <button
                                className="table-action-icon-btn"
                                title="Edit Post"
                                onClick={() => handleBlogEdit(post)}
                              >
                                <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button
                                className="table-action-icon-btn delete"
                                title="Delete Post"
                                onClick={() => handleBlogDelete(post.id)}
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="table-empty-state">
                    <span className="material-symbols-outlined empty-icon">article</span>
                    <h4 className="empty-heading font-headline-md">No Blog Posts Yet</h4>
                    <p className="empty-desc font-body-md">Click "New Post" above to create your first blog article.</p>
                  </div>
                )}
              </>
            )}

            {/* Newsletter Subscribers Table */}
            {activeTab === 'newsletters' && (
              <>
                {getFilteredNewsletters().length > 0 ? (
                  <table className="admin-table small-table">
                    <thead>
                      <tr>
                        <th className="font-label-sm text-left">Subscription Date</th>
                        <th className="font-label-sm text-left">Record ID</th>
                        <th className="font-label-sm text-left">Registered Email Address</th>
                        <th className="font-label-sm text-left">Status</th>
                        <th className="font-label-sm text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredNewsletters().map(lead => (
                        <tr key={lead.id} className="admin-table-row">
                          <td>
                            <div className="table-cell-date">{formatDate(lead.date)}</div>
                          </td>
                          <td>
                            <div className="table-cell-id">{lead.id}</div>
                          </td>
                          <td>
                            <div className="table-cell-email font-body-md">{lead.email}</div>
                          </td>
                          <td>
                            <select 
                              className={`status-selector-dropdown ${lead.status.toLowerCase()}`}
                              value={lead.status}
                              onChange={(e) => handleNewsletterStatusChange(lead.id, e.target.value)}
                            >
                              <option value="Active">Active</option>
                              <option value="Unsubscribed">Unsubscribed</option>
                            </select>
                          </td>
                          <td>
                            <div className="table-actions-cell">
                              <button 
                                className="table-action-icon-btn delete" 
                                title="Delete Record"
                                onClick={() => handleNewsletterDelete(lead.id)}
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="table-empty-state">
                    <span className="material-symbols-outlined empty-icon">unsubscribe</span>
                    <h4 className="empty-heading font-headline-md">No Subscribers Found</h4>
                    <p className="empty-desc font-body-md">There are no email newsletter leads currently matching.</p>
                  </div>
                )}
              </>
            )}

          </div>
        </section>

      </main>
    </div>
  );
};

export default AdminDashboard;
