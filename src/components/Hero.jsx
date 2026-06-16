import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const [videoEnded, setVideoEnded] = useState(false);

    const handleVideoEnded = () => {
        setVideoEnded(true);
    };

    return (
        <section className="hero">
            <div className="hero__background">
                <img 
                    alt="Luxury Property Facade" 
                    className="hero__image" 
                    src="/images/hero bg new.png"
                />
                <video 
                    className={`hero__video ${videoEnded ? 'hero__video--ended' : ''}`}
                    src="/images/blisstown video.mp4"
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnded}
                />
                <div className="hero__overlay"></div>
            </div>

            <div className="hero__container container">
                <div className="hero__content reveal-up">
                    <div className="hero__tagline-wrapper">
                        <span className="hero__tagline-line"></span>
                        <span className="hero__tagline-text">Premium Urban Living</span>
                    </div>

                    <h1 className="hero__main-title">
                        Future Living <br /> <em>Designed</em> <br />for Visionaries
                    </h1>

                    <div className="hero__actions-group">
                        <Link to="/contact" className="hero__btn-explore" style={{ textDecoration: 'none' }}>
                            Get in touch <span className="btn-chevron">›</span>
                        </Link>
                    </div>
                </div>
            </div>
            
            <div className="hero__scroll-indicator">
                <span className="material-symbols-outlined hero__scroll-icon">keyboard_double_arrow_down</span>
            </div>
        </section>
    );
};

export default Hero;
