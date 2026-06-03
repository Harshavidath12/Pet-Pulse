import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

/* Inner app — needs router context for useLocation */
function AppInner() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const location = useLocation();

  // Open auth modal if redirected from ProtectedRoute
  useEffect(() => {
    if (location.state?.openAuth) {
      setAuthOpen(true);
    }
  }, [location.state]);

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      {/* Only show public navbar/footer on non-dashboard pages */}
      {!isDashboard && <Navbar onOpenAuth={openAuth} />}

      <Routes>
        <Route path="/" element={<Home onOpenAuth={openAuth} />} />
        <Route path="/about"    element={<PlaceholderPage title="About Us" />} />
        <Route path="/services" element={<PlaceholderPage title="Our Services" />} />
        <Route path="/blog"     element={<PlaceholderPage title="Blog" />} />
        <Route path="/contact"  element={<PlaceholderPage title="Contact Us" />} />
        <Route path="/privacy"  element={<PlaceholderPage title="Privacy Policy" />} />
        <Route path="/terms"    element={<PlaceholderPage title="Terms of Service" />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isDashboard && <Footer />}

      {/* Auth modal — globally accessible */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}

/* Temporary placeholder for pages not yet built */
function PlaceholderPage({ title }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', paddingTop: '80px',
      background: 'var(--bg-primary)', gap: '20px',
    }}>
      <div style={{ fontSize: '64px', animation: 'bannerFloat 3s ease-in-out infinite' }}>🐾</div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: '42px',
        background: 'var(--gradient-green)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      }}>
        {title}
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
        This page is coming soon! 🌿
      </p>
    </div>
  );
}

export default App;
