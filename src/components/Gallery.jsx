import React from 'react';
import CircularGallery from './CircularGallery';
import './Gallery.css';

const gallerySlides = [
    {
        image: "/images/gallery 1.avif",
        title: "Master Bedroom",
        desc: "Unrivaled views of the skyline through expansive glass walls."
    },
    {
        image: "/images/gallery 2.avif",
        title: "Living Room",
        desc: "Private infinity pools designed for ultimate restoration."
    },
    {
        image: "/images/gallery 3.avif",
        title: "Modular Kitchen",
        desc: "Bespoke health clubs, state-of-the-art spas, and private lounges."
    },
    {
        image: "/images/gallery 4.avif",
        title: "Swimming Pool",
        desc: "Submerge in our temp-controlled infinity pool overlooking the skyline."
    },
    {
        image: "/images/gallery 5.avif",
        title: "Garden View",
        desc: "Lush botanical gardens offering a serene landscape retreat."
    }
];

const Gallery = () => {
    const [activeIndex, setActiveIndex] = React.useState(null);

    React.useEffect(() => {
        if (activeIndex === null) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setActiveIndex(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex]);

    // Map slides to CircularGallery expected items format: { image, text }
    const items = React.useMemo(() => gallerySlides.map(slide => ({
        image: slide.image,
        text: ""
    })), []);

    const handleCardClick = React.useCallback((index) => {
        setActiveIndex(index);
    }, []);

    const activeSlide = activeIndex !== null ? gallerySlides[activeIndex] : null;

    return (
        <section className="gallery-section reveal-up">
            <div className="gallery-header">
                <span className="gallery-subtitle">CONSTRUCTION UPDATE</span>
                <h2 className="gallery-main-title">Construction Progress</h2>
                <div className="gallery-header-line"></div>
            </div>
            <div className="circular-gallery-wrapper">
                <CircularGallery
                    items={items}
                    bend={0}
                    textColor="#ffffff"
                    borderRadius={0.05}
                    scrollEase={0.05}
                    fontUrl="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
                    font="bold 26px Montserrat"
                    scrollSpeed={2}
                    onClick={handleCardClick}
                />
            </div>

            {activeSlide && (
                <div className="gallery-lightbox" onClick={() => setActiveIndex(null)}>
                    <div className="gallery-lightbox-card" onClick={(e) => e.stopPropagation()}>
                        <button className="gallery-lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close lightbox">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div className="gallery-lightbox-image-container">
                            <img src={activeSlide.image} alt={activeSlide.title} />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;
