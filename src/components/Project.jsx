import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Project.css';

const Project = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('[class*="reveal-"]');
    if (elements) {
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="featured-project-section" id="project" ref={sectionRef}>
      <div className="featured-project-container container">
        
        {/* Section Header */}
        <div className="project-section-header reveal-up">
          <div className="project-section-title-group">
            <span className="font-subheading-lg text-gold">What we do</span>
            <h2 className="project-section-title">Latest projects</h2>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="project-two-col-layout">
          
          {/* Left Column: Project Card */}
          <div className="project-left-col reveal-left">
            <Link to="/project" className="project-grid-card">
              <div className="project-card-image-wrapper">
                <img 
                  alt="JMDR Arihant Green - Signature Residences" 
                  className="project-card-image" 
                  src="/images/Project Image.avif" 
                />
                <div className="project-card-arrow-badge">
                  <span className="material-symbols-outlined">arrow_outward</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column: Project Info */}
          <div className="project-right-col reveal-right" style={{ transitionDelay: '0.25s' }}>
            <span className="font-subheading-lg text-gold">Latest Venture</span>
            <h3 className="project-info-name">JMDR Arihant Green</h3>
            <p className="project-info-location">Sector 1, Greater Noida West</p>
            <div className="project-info-separator"></div>
            
            <p className="project-info-desc">
              Experience the pinnacle of high-end living in the heart of Greater Noida West. JMDR Arihant Green offers meticulously designed modern residences integrated with state-of-the-art amenities, wide open landscapes, and excellent connectivity.
            </p>

            <Link to="/project" className="btn-black-pill project-info-btn">
              Read More
              <div className="arrow-circle">
                <span className="material-symbols-outlined">arrow_outward</span>
              </div>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Project;
