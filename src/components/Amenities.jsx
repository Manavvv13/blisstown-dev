import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Amenities.css';

const amenitiesData = [
  { icon: 'pool', text: 'Swimming Pool', desc: 'Submerge in our temp-controlled infinity pool overlooking the skyline.', image: '/images/swimming pool.jpg' },
  { icon: 'house', text: 'Clubhouse', desc: 'Bespoke 24/7 butler and concierge services to assist your daily life.', image: '/images/clubhouse_new.png' },
  { icon: 'toys', text: 'Kids Play Area', desc: 'An open sky retreat tailored for intimate gatherings and stargazing.', image: '/images/kids_play_area_new.png' },
  { icon: 'fitness_center', text: 'Gym', desc: 'A state-of-the-art gym, luxury spa, and restorative yoga deck.', image: '/images/luxury_gym_new.png' },
];

const Amenities = () => {
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
    <section className="amenities-section" id="about" ref={sectionRef}>
      <div className="amenities-layout container">
        {/* Centered Header */}
        <div className="amenities-header reveal-up">
          <span className="font-subheading-lg text-gold">The Art of Living</span>
          <h2 className="amenities-title">Exclusive Services</h2>
          <div className="amenities-divider"></div>
        </div>

        {/* 4-Card Grid */}
        <div className="amenities-grid">
          {amenitiesData.map((item, index) => (
            <div className="amenity-card reveal-up" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
              <div className="amenity-card-image-wrapper">
                <img
                  src={item.image}
                  alt={item.text}
                  className="amenity-card-image"
                  loading="lazy"
                />
                <div className="amenity-card-overlay"></div>
              </div>

              <div className="amenity-card-content">
                <div className="amenity-card-header">
                  <div className="amenity-card-icon-wrapper">
                    <span className="material-symbols-outlined amenity-card-icon">{item.icon}</span>
                  </div>
                  <h3 className="amenity-card-title">{item.text}</h3>
                </div>
                
                <p className="amenity-card-desc">{item.desc}</p>
                
                <Link to="/project" className="amenity-card-btn">
                  <span>Explore Details</span>
                  <span className="material-symbols-outlined btn-arrow">arrow_outward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
