import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SafetyPolicy.css';

const SafetyPolicy = () => {
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
          <h1 className="font-display-xl policy-page-title reveal-up">Safety Policy</h1>
          <nav className="policy-breadcrumb reveal-up">
            <Link to="/" className="breadcrumb-item" style={{ textDecoration: 'none' }}>Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/about-us" className="breadcrumb-item" style={{ textDecoration: 'none' }}>About Us</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Safety Policy</span>
          </nav>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="policy-content-section section">
        <div className="container">
          
          {/* Top Block: Statement & Experience Card */}
          <div className="policy-top-grid">
            <div className="policy-statement-wrapper reveal-up">
              <p className="font-body-lg policy-intro" style={{ marginBottom: 0 }}>
                Blisstown exert every effort to abide by all regulations as they pertain to the construction industry which is set for
                standards and good practices.
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
              <h2 className="policy-objectives-title">Key Safety Objectives</h2>
              <div className="policy-objectives-line"></div>
            </div>

            <div className="policy-objectives-grid reveal-up">
              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">health_and_safety</span>
                </div>
                <p className="font-body-md point-text">Maintain a safe and healthful work environment in order to prevent injuries.</p>
              </div>

              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">policy</span>
                </div>
                <p className="font-body-md point-text">Follow all regulations that pertain to the construction industry.</p>
              </div>

              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">construction</span>
                </div>
                <p className="font-body-md point-text">Minimize equipment damage.</p>
              </div>

              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">engineering</span>
                </div>
                <p className="font-body-md point-text">Promote employee involvement with safety.</p>
              </div>

              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">analytics</span>
                </div>
                <p className="font-body-md point-text">Suggest corrective actions to be taken to eliminate any further incidents.</p>
              </div>

              <div className="policy-point-card glass-panel">
                <div className="point-icon-wrapper">
                  <span className="material-symbols-outlined policy-icon">medical_services</span>
                </div>
                <p className="font-body-md point-text"><strong>First Aid:</strong> Although we strive to have accident-free workplaces, in case of an injury Bliss Town provides First Aid service and provisions for medical care for all employees.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default SafetyPolicy;
