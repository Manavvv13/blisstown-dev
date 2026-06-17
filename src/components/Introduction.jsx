import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
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
                    <span className="font-subheading-lg intro-tag">About Us</span>
                    <div className="intro-image-wrapper">
                        <img 
                            src="/images/About us blisstown.png" 
                            alt="Luxury Architecture Facade" 
                            className="intro-image"
                        />
                    </div>
                </div>

                {/* Right Column: High-Contrast Highlighted Typography */}
                <div className="intro-right reveal-right" style={{ transitionDelay: '0.2s' }}>
                    <ScrollReveal
                        baseOpacity={0.1}
                        enableBlur={true}
                        baseRotation={3}
                        blurStrength={3}
                        containerClassName="intro-scroll-reveal"
                        textClassName="intro-highlight-title"
                        wordAnimationEnd="top 30%"
                        rotationEnd="top 40%"
                    >
                        We're a team of developers and architects dedicated to building smarter, more sustainable homes tailored to the way you live today, and ready for the demands of tomorrow.
                    </ScrollReveal>

                    <div className="intro-actions">
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
