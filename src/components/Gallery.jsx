import React from 'react';
import CircularGallery from './CircularGallery';
import './Gallery.css';

const gallerySlides = [
    {
        image: "/images/img 1.jpeg",
        title: "Master Bedroom",
        desc: "Unrivaled views of the skyline through expansive glass walls."
    },
    {
        image: "/images/img 2.jpeg",
        title: "Living Room",
        desc: "Private infinity pools designed for ultimate restoration."
    },
    {
        image: "/images/img 3.jpeg",
        title: "Modular Kitchen",
        desc: "Bespoke health clubs, state-of-the-art spas, and private lounges."
    },
    {
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
        title: "Lush Sky Mansions",
        desc: "Stunning architectural terraces suspended in light and space."
    }
];

const Gallery = () => {
    // Map slides to CircularGallery expected items format: { image, text }
    const items = gallerySlides.map(slide => ({
        image: slide.image,
        text: slide.title
    }));

    return (
        <section className="gallery-section reveal-up">
            <div className="gallery-header">
                <span className="gallery-subtitle">AESTHETIC LIVING</span>
                <h2 className="gallery-main-title">Crafted Interiors</h2>
                <div className="gallery-header-line"></div>
            </div>
            <div className="circular-gallery-wrapper">
                <CircularGallery
                    items={items}
                    bend={3}
                    textColor="#ffffff"
                    borderRadius={0.05}
                    scrollEase={0.05}
                    fontUrl="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
                    font="bold 26px Montserrat"
                    scrollSpeed={2}
                />
            </div>
        </section>
    );
};

export default Gallery;
