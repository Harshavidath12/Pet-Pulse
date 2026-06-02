import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Placeholder routes for future pages */}
        <Route path="/about" element={<PlaceholderPage title="About Us" />} />
        <Route path="/services" element={<PlaceholderPage title="Our Services" />} />
        <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
        <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
        <Route path="/appointments" element={<PlaceholderPage title="Book Appointment" />} />
        <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
        <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
        <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

/* Temporary placeholder for pages not yet built */
function PlaceholderPage({ title }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '80px',
      background: 'var(--bg-primary)',
      gap: '20px',
    }}>
      <div style={{ fontSize: '64px', animation: 'bannerFloat 3s ease-in-out infinite' }}>🐾</div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '42px',
        background: 'var(--gradient-green)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
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
