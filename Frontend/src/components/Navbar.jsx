import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Left – Phone Number */}
      <a href="tel:0726009790" className="navbar-phone">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
        </svg>
        <span>0726009790</span>
      </a>

      {/* Center – Nav Links */}
      <ul className="navbar-links">
        {[
          { label: 'Home',     to: '/'        },
          { label: 'About',    to: '/about'   },
          { label: 'Services', to: '/services'},
          { label: 'Blog',     to: '/blog'    },
          { label: 'Contact',  to: '/contact' },
        ].map(({ label, to }) => (
          <li key={label}>
            <NavLink
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right – Auth / Profile */}
      <div className="navbar-profile">
        {user ? (
          /* Logged-in: show avatar + go to dashboard */
          <Link to="/dashboard" className="profile-btn" id="go-to-dashboard-btn">
            <div className="profile-avatar" style={{
              background: 'rgba(255,255,255,0.3)',
              fontSize: '13px',
              fontWeight: 800,
              color: 'white',
            }}>
              {user.avatar || user.name?.[0] || 'U'}
            </div>
            {user.name?.split(' ')[0]}
          </Link>
        ) : (
          /* Not logged in: Sign In button */
          <button
            className="profile-btn"
            onClick={() => onOpenAuth?.('login')}
            id="profile-btn"
          >
            <div className="profile-avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
