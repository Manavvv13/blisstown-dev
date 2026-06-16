import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublishedBlogPosts } from '../utils/blogHelper';
import './BlogPage.css';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPublishedBlogPosts();
        setPosts(data);
      } catch (err) {
        console.error('Error loading blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [posts]);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return ''; }
  };

  const getReadTime = (content = '') => {
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };

  return (
    <div className="blog-page">
      {/* Page Header */}
      <section className="blog-header">
        <div className="container">
          <h1 className="font-display-xl blog-page-title reveal-up">Insights &amp; Stories</h1>
          <p className="blog-page-subtitle reveal-up">
            Perspectives on luxury living, architecture, and the future of real estate.
          </p>
          <nav className="blog-breadcrumb reveal-up">
            <Link to="/" className="breadcrumb-item" style={{ textDecoration: 'none' }}>Home</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Blog</span>
          </nav>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="blog-grid-section section">
        <div className="container">
          {loading ? (
            <div className="blog-loading">
              <div className="blog-loader" />
              <p>Loading stories…</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="blog-empty reveal-up">
              <span className="material-symbols-outlined blog-empty-icon">article</span>
              <h3>No Posts Yet</h3>
              <p>Check back soon — our team is crafting stories for you.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post, i) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="blog-card reveal-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="blog-card-image-wrapper">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="blog-card-image"
                      />
                    ) : (
                      <div className="blog-card-image-placeholder">
                        <span className="material-symbols-outlined">article</span>
                      </div>
                    )}
                  </div>
                  <div className="blog-card-body">
                    <div className="blog-card-meta">
                      <span className="blog-card-date">{formatDate(post.createdAt)}</span>
                      <span className="blog-card-dot">·</span>
                      <span className="blog-card-read">{getReadTime(post.content)} min read</span>
                    </div>
                    <h2 className="blog-card-title">{post.title}</h2>
                    {post.excerpt && (
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                    )}
                    <div className="blog-card-author-row">
                      <span className="blog-card-author-icon material-symbols-outlined">person</span>
                      <span className="blog-card-author">{post.author}</span>
                      <span className="blog-card-read-more">
                        Read More <span className="material-symbols-outlined">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
