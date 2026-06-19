import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CompletedProjects.css';

const completedProjects = [
  {
    id: 1,
    name: 'Maxblis Grand Kingston',
    location: 'Sector 75, Noida',
    icon: 'domain',
    status: 'Delivered on Time',
    image: '/images/img 1.jpeg',
    description: 'A benchmark of luxury living in Sector 75, Noida, Maxblis Grand Kingston offers exquisitely designed 2, 3, and 4 BHK premium apartments. Designed for modern families, it boasts lush landscapes, wide open spaces, and premium infrastructure.',
    details: [
      { label: 'Total Units', value: '480 Residences' },
      { label: 'Project Type', value: 'Residential Complex' },
      { label: 'Key Amenities', value: 'Clubhouse, Swimming Pool, Fitness Center, 24/7 Security' },
      { label: 'Status', value: 'Completed & Delivered' }
    ]
  },
  {
    id: 2,
    name: 'Maxblis Grand Wellington',
    location: 'Sector 75, Noida',
    icon: 'location_city',
    status: 'Delivered on Time',
    image: '/images/img 2.jpeg',
    description: 'Maxblis Grand Wellington stands as a testament to high-quality construction and architectural finesse. The project provides beautifully ventilated spacious homes surrounded by nature, with excellent connectivity to major business hubs.',
    details: [
      { label: 'Total Units', value: '350 Residences' },
      { label: 'Project Type', value: 'Premium Residential' },
      { label: 'Key Amenities', value: 'Lush Gardens, Indoor Games Room, Jogging Track, Tennis Courts' },
      { label: 'Status', value: 'Completed & Delivered' }
    ]
  },
  {
    id: 3,
    name: 'Maxblis White House',
    location: 'Sector 75, Noida',
    icon: 'home_work',
    status: 'Delivered on Time',
    image: '/images/img 3.jpeg',
    description: 'Inspired by classic architectural lines, Maxblis White House offers an elite community experience with high-end apartments and top-tier amenities. Featuring large balconies and modern smart-home layouts, it provides absolute comfort.',
    details: [
      { label: 'Total Units', value: '220 Residences' },
      { label: 'Project Type', value: 'Luxury Apartments' },
      { label: 'Key Amenities', value: 'Children\'s Play Park, Ample Covered Parking, Badminton Court' },
      { label: 'Status', value: 'Completed & Delivered' }
    ]
  },
];

const CompletedProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const openProjectModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // prevent background scrolling
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset'; // restore background scrolling
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeProjectModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="completed-projects-page">
      {/* Page Header */}
      <section className="completed-projects-header">
        <div className="container">
          <h1 className="font-display-xl completed-projects-page-title reveal-up">
            Completed Projects
          </h1>
          <nav className="completed-projects-breadcrumb reveal-up">
            <Link to="/" className="breadcrumb-item" style={{ textDecoration: 'none' }}>
              Home
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Completed Projects</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="completed-projects-content section">
        <div className="container">
          <div className="completed-projects-intro reveal-up">
            <span className="font-subheading-lg text-gold">Performance</span>
            <h2 className="font-headline-lg completed-projects-subtitle">
              Our Track Record Speaks For Itself
            </h2>
            <p className="completed-projects-desc">
              With a 100% on-time delivery record and zero litigation history, our completed
              projects stand as a testament to our commitment to quality and trust.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="completed-projects-grid reveal-up" style={{ transitionDelay: '0.2s' }}>
            {completedProjects.map((project) => (
              <div 
                className="completed-project-card" 
                key={project.id}
                onClick={() => openProjectModal(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openProjectModal(project);
                  }
                }}
              >
                <img src={project.image} alt={project.name} className="completed-card-bg-image" />
                <div className="completed-card-gradient-overlay"></div>
                <div className="completed-card-content">
                  <div className="completed-card-icon">
                    <span className="material-symbols-outlined">{project.icon}</span>
                  </div>
                  <h3 className="completed-card-title">{project.name}</h3>
                  <p className="completed-card-location">{project.location}</p>
                  <div className="completed-badge-container">
                    <span className="completed-badge">{project.status}</span>
                  </div>
                </div>
                <div className="card-click-hint">
                  <span>View Details</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="completed-stats-container reveal-up" style={{ transitionDelay: '0.3s' }}>
            <div className="completed-stat-card">
              <span className="completed-stat-number">100%</span>
              <span className="completed-stat-label">Delivery Record</span>
            </div>
            <div className="completed-stat-divider"></div>
            <div className="completed-stat-card">
              <span className="completed-stat-number">0</span>
              <span className="completed-stat-label">Litigation History</span>
            </div>
            <div className="completed-stat-divider"></div>
            <div className="completed-stat-card">
              <span className="completed-stat-number">RERA</span>
              <span className="completed-stat-label">Full Compliance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="completed-modal-overlay" onClick={closeProjectModal}>
          <div className="completed-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="completed-modal-close" onClick={closeProjectModal} aria-label="Close modal">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="completed-modal-grid">
              <div className="completed-modal-image-wrapper">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.name} 
                  className="completed-modal-image" 
                />
              </div>
              <div className="completed-modal-info">
                <span className="completed-modal-subtitle">{selectedProject.location}</span>
                <h2 className="completed-modal-title">{selectedProject.name}</h2>
                <div className="completed-modal-badge-container">
                  <span className="completed-modal-badge">{selectedProject.status}</span>
                </div>
                <p className="completed-modal-description">{selectedProject.description}</p>
                
                <div className="completed-modal-details-list">
                  {selectedProject.details.map((detail, index) => (
                    <div className="completed-modal-detail-item" key={index}>
                      <span className="completed-modal-detail-label">{detail.label}</span>
                      <span className="completed-modal-detail-value">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedProjects;
