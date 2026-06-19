import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Amenities.css';

const amenitiesData = [
  { icon: 'pool', text: 'Swimming Pool', desc: 'Submerge in our temp-controlled infinity pool overlooking the skyline.', image: '/images/infinity_pool.png' },
  { icon: 'house', text: 'Clubhouse', desc: 'Bespoke 24/7 butler and concierge services to assist your daily life.', image: '/images/private_concierge.png' },
  { icon: 'toys', text: 'Kids Play Area', desc: 'An open sky retreat tailored for intimate gatherings and stargazing.', image: '/images/rooftop_lounge.png' },
  { icon: 'fitness_center', text: 'Gym', desc: 'A state-of-the-art gym, luxury spa, and restorative yoga deck.', image: '/images/elite_wellness.png' },
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
        {/* Left Sidebar - Sticky Header */}
        <div className="amenities-sidebar reveal-up">
          <span className="font-subheading-lg text-gold">The Art of Living</span>
          <h2 className="amenities-title">Exclusive Services</h2>
          <div className="amenities-divider"></div>
          <p className="amenities-sidebar-desc">
            We design from scratch shaped by your vision, not a predefined template.
          </p>
        </div>

        {/* Right Content - Service Rows */}
        <div className="amenities-services">
          {amenitiesData.map((item, index) => (
            <div className="amenity-row reveal-up" key={index}>
              <div className="amenity-row-text">
                <h3 className="amenity-row-title">{item.text}</h3>
                <p className="amenity-row-desc">{item.desc}</p>
                <Link to="/project" className="amenity-explore-btn">
                  <span className="amenity-explore-label">Explore More</span>
                  <span className="amenity-explore-arrow">
                    <span className="material-symbols-outlined">arrow_outward</span>
                  </span>
                </Link>
              </div>
              <div className="amenity-row-image-wrapper">
                <img
                  src={item.image}
                  alt={item.text}
                  className="amenity-row-image"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
