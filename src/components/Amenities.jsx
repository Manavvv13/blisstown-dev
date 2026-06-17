import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import './Amenities.css';

const amenitiesData = [
  { icon: 'pool', text: 'Infinity Pool', desc: 'Submerge in our temp-controlled infinity pool overlooking the skyline.', image: '/images/infinity_pool.png' },
  { icon: 'concierge', text: 'Private Concierge', desc: 'Bespoke 24/7 butler and concierge services to assist your daily life.', image: '/images/private_concierge.png' },
  { icon: 'wine_bar', text: 'Rooftop Lounge', desc: 'An open sky retreat tailored for intimate gatherings and stargazing.', image: '/images/rooftop_lounge.png' },
  { icon: 'fitness_center', text: 'Elite Wellness', desc: 'A state-of-the-art gym, luxury spa, and restorative yoga deck.', image: '/images/elite_wellness.png' },
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
      {/* Canyon glow background decoration */}
      <div className="amenities-canyon-glow"></div>
      
      {/* Giant backdrop text */}
      <div className="amenities-bg-title">Amenities</div>

      <div className="amenities-header reveal-up">
        <span className="font-subheading-lg text-gold">The Art of Living</span>
        <h2 className="amenities-title">Exclusive Services</h2>
        <div className="amenities-divider"></div>
      </div>

      <ScrollStack 
        useWindowScroll={true} 
        className="amenities-stack-container" 
        itemDistance={50}
        itemStackDistance={25}
        stackPosition="25%"
        baseScale={0.9}
        itemScale={0.03}
        blurAmount={0}
      >
        {amenitiesData.map((item, index) => (
          <ScrollStackItem key={index}>
            <Link
              to="/project"
              className="amenity-card-link-content"
            >
              <div className="amenity-card-text-container">
                <div className="amenity-card-header">
                  <span className="material-symbols-outlined amenity-icon">{item.icon}</span>
                  <h3 className="amenity-card-title">{item.text}</h3>
                </div>
                <p className="amenity-card-desc">{item.desc}</p>
                <div className="amenity-read-more">
                  <span>Read More</span>
                  <span className="material-symbols-outlined read-more-arrow">arrow_right_alt</span>
                </div>
              </div>
              <div className="amenity-card-image-container">
                <img 
                  src={item.image} 
                  alt={item.text} 
                  className="amenity-card-image"
                  loading="lazy"
                />
              </div>
            </Link>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
};

export default Amenities;
