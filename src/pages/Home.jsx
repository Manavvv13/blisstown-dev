import { useEffect } from 'react';
import Hero from '../components/Hero';
import Introduction from '../components/Introduction';
import Stats from '../components/Stats';
import Project from '../components/Project';
import Amenities from '../components/Amenities';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const Home = () => {
  useEffect(() => {
    // Reveal on scroll logic
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <main>
        <Hero />
        <Introduction />
        <Stats />
        <Project />
        <Amenities />
        <Gallery />
        <Testimonials />
        <Newsletter />
      </main>

    </>
  );
};

export default Home;
