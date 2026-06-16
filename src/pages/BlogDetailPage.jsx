import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchBlogPostById, fetchPublishedBlogPosts } from '../utils/blogHelper';
import './BlogDetailPage.css';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchBlogPostById(id);
        if (!data || !data.published) {
          navigate('/blog');
          return;
        }
        setPost(data);

        // Load other published posts (excluding current) as "More Articles"
        const all = await fetchPublishedBlogPosts();
        const rel = all.filter(p => p.id !== id).slice(0, 3);
        setRelated(rel);
      } catch (err) {
        console.error('Error loading post:', err);
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch { return ''; }
  };

  const getReadTime = (content = '') => {
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="blog-loader" />
        <p>Loading post…</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="blog-detail-page">

      {/* Hero Banner */}
      <section className="blog-detail-hero">
        {post.coverImage && (
          <div className="blog-detail-hero-bg">
            <img src={post.coverImage} alt={post.title} className="blog-detail-hero-img" />
            <div className="blog-detail-hero-overlay" />
          </div>
        )}
        <div className="container blog-detail-hero-content">
          <nav className="blog-breadcrumb">
            <Link to="/" className="breadcrumb-item" style={{ textDecoration: 'none' }}>Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/blog" className="breadcrumb-item" style={{ textDecoration: 'none' }}>Blog</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{post.title}</span>
          </nav>

          <h1 className="blog-detail-title">{post.title}</h1>

          <div className="blog-detail-meta">
            <span className="material-symbols-outlined meta-icon">person</span>
            <span className="meta-author">{post.author}</span>
            <span className="meta-dot">·</span>
            <span className="material-symbols-outlined meta-icon">calendar_today</span>
            <span>{formatDate(post.createdAt)}</span>
            <span className="meta-dot">·</span>
            <span className="material-symbols-outlined meta-icon">schedule</span>
            <span>{getReadTime(post.content)} min read</span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="blog-detail-body-section">
        <div className="container blog-detail-layout">

          <article className="blog-detail-article">
            {post.excerpt && (
              <p className="blog-detail-excerpt">{post.excerpt}</p>
            )}
            <div
              className="blog-detail-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="blog-detail-tags">
                <span className="material-symbols-outlined tag-icon">label</span>
                {post.tags.map(tag => (
                  <span key={tag} className="blog-tag">{tag}</span>
                ))}
              </div>
            )}

            <div className="blog-detail-back">
              <Link to="/blog" className="blog-back-btn">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to All Posts
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="blog-detail-sidebar">
            <div className="sidebar-card">
              <h4 className="sidebar-heading">About the Author</h4>
              <div className="sidebar-author">
                <div className="sidebar-author-avatar">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <div>
                  <p className="sidebar-author-name">{post.author}</p>
                  <p className="sidebar-author-role">Bliss Town Developers</p>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="sidebar-card">
                <h4 className="sidebar-heading">More Articles</h4>
                <div className="sidebar-related-list">
                  {related.map(rel => (
                    <Link key={rel.id} to={`/blog/${rel.id}`} className="sidebar-related-item">
                      {rel.coverImage && (
                        <img src={rel.coverImage} alt={rel.title} className="sidebar-related-img" />
                      )}
                      <span className="sidebar-related-title">{rel.title}</span>
                      <span className="material-symbols-outlined sidebar-related-arrow">arrow_forward</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;
