import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './QualityPolicy.css';

const QualityPolicy = () => {
  useEffect(() => {
    // Reveal on scroll logic
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="policy-page">
      {/* Page Header */}
      <section className="policy-header">
        <div className="container">
          <h1 className="font-display-xl policy-page-title reveal-up">Quality Policy</h1>
          <nav className="policy-breadcrumb reveal-up">
            <Link to="/" className="breadcrumb-item" style={{ textDecoration: 'none' }}>Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/about-us" className="breadcrumb-item" style={{ textDecoration: 'none' }}>About Us</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Quality Policy</span>
          </nav>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="policy-content-section section">
        <div className="container">
          
          {/* Top Block: Statement & Experience Card */}
          <div className="policy-top-grid">
            <div className="policy-statement-wrapper reveal-up">
              <p className="font-body-lg policy-intro">
                It is the policy of Blisstown to accomplish Real Estate developments of various types through the employment of
                experienced Contractors and Specialist Subcontractors to achieve quality excellence consistent with all Client’s
                requirements, applicable codes and standards.
              </p>
              <p className="font-body-md policy-paragraph">
                The Contractors and or Specialist Subcontractors will be employed on the clear understanding that they must follow the
                requirements of our Quality Management System.
              </p>
            </div>

            <div className="policy-experience-container reveal-up" style={{ transitionDelay: '0.1s' }}>
              <div className="experience-card glass-panel-heavy">
                <div className="experience-number-wrapper">
                  <span className="experience-number">25</span>
                </div>
                <div className="experience-text">
                  <span className="experience-label">Years</span>
                  <span className="experience-label">Working</span>
                  <span className="experience-label highlight">Experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Block: Points Grid */}
          <div className="policy-objectives-section">
            <div className="policy-objectives-header reveal-up">
              <span className="font-subheading-lg text-gold">Commitments</span>
              <h2 className="policy-objectives-title">Key Quality Objectives</h2>
              <div className="policy-objectives-line"></div>
            </div>

            <div className="policy-objectives-grid reveal-up">
              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">eco</span>
                </div>
                <p className="font-body-md point-text">Ensure compliance to all applicable laws and legal requirements related to Environmental aspects; and implement Environment Management Program to prevent pollution and waste of resources.</p>
              </div>

              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">gavel</span>
                </div>
                <p className="font-body-md point-text">Ensure compliance to all applicable building bye-laws and deliver safe buildings.</p>
              </div>

              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">assignment_turned_in</span>
                </div>
                <p className="font-body-md point-text">Ensure compliance to all applicable legal and statutory requirements related to project development and construction.</p>
              </div>

              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">shield</span>
                </div>
                <p className="font-body-md point-text">Ensure compliance to all safety laws and requirements; and provide for safety of workers, personnel, material and machinery.</p>
              </div>

              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">groups</span>
                </div>
                <p className="font-body-md point-text">Ensure high level of competency and team work in the organization by providing effective leadership, communication and training.</p>
              </div>

              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">trending_up</span>
                </div>
                <p className="font-body-md point-text">The management is committed to the continual improvement of the Quality Management System.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default QualityPolicy;
