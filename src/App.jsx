import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages - Code-split using React.lazy
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const ChairmanMessage = lazy(() => import('./pages/ChairmanMessage'));
const ManagementTeam = lazy(() => import('./pages/ManagementTeam'));
const QualityPolicy = lazy(() => import('./pages/QualityPolicy'));
const SafetyPolicy = lazy(() => import('./pages/SafetyPolicy'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const CompletedProjects = lazy(() => import('./pages/CompletedProjects'));
const Contact = lazy(() => import('./pages/Contact'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Scroll to top on navigation helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  
  return null;
};

// Elegant centered loading fallback spinner matching golden theme
const PageLoader = () => (
  <div className="page-loader" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    width: '100%',
    background: 'transparent'
  }}>
    <div className="spinner" style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(212, 175, 55, 0.1)',
      borderTop: '3px solid var(--primary)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Layout for public pages to ensure header/footer are present
const PublicLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

function App() {

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

    const setupObserver = () => {
      document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
    };

    const timeoutId = setTimeout(setupObserver, 200);
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        <Routes>
          {/* Public Website Routes */}
          <Route element={
            <PublicLayout />
          }>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/chairman-message" element={<ChairmanMessage />} />
            <Route path="/management-team" element={<ManagementTeam />} />
            <Route path="/quality-policy" element={<QualityPolicy />} />
            <Route path="/safety-policy" element={<SafetyPolicy />} />
            <Route path="/project" element={<ProjectPage />} />
            <Route path="/completed-projects" element={<CompletedProjects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
          </Route>
          
          {/* Admin Dashboard - Standalone */}
          <Route path="/admin" element={
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
