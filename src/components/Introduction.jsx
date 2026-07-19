import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Introduction.css';

const Introduction = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const elements = sectionRef.current?.querySelectorAll('[class*="reveal-"]');
        if (elements) {
            elements.forEach(el => observer.observe(el));
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <section className="intro-section" ref={sectionRef}>
            <div className="intro-container container">
                
                {/* Left Column: Heading and Rounded Image */}
                <div className="intro-left reveal-left">
                    <h2 className="intro-tag">About Us</h2>
                    <div className="intro-image-wrapper">
                        <img 
                            src="/images/About us blisstown.avif" 
                            alt="Luxury Architecture Facade" 
                            className="intro-image"
                        />
                    </div>
                </div>

                {/* Right Column: High-Contrast Typography */}
                <div className="intro-right">
                    <p className="intro-highlight-title reveal-up" style={{ transitionDelay: '0.1s' }}>
                        We're a team of developers and architects dedicated to building smarter, more sustainable homes tailored to the way you live today, and ready for the demands of tomorrow.
                    </p>
                    <p className="intro-paragraph reveal-up" style={{ transitionDelay: '0.25s' }}>
                        Bliss Town Developers Pvt. Ltd., backed by the renowned Maxblis Group, brings decades of construction excellence to Greater Noida. With a vision to redefine real estate standards, we combine modern architectural concepts, robust engineering practices, and transparent customer relations to deliver landmark addresses.
                    </p>

                    <div className="intro-actions reveal-up" style={{ transitionDelay: '0.4s' }}>
                        <Link to="/about-us" className="btn-black-pill">
                            Get Started
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

export default Introduction;
