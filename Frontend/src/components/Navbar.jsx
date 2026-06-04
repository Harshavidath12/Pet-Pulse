import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  /* ── Notification bell ── fetched from API ── */
  const [notifications, setNotifications] = useState([]);
  const [notifOpen,  setNotifOpen]  = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      import('../api').then(({ default: api }) => {
        api.get('/api/notifications/my')
          .then(res => setNotifications(res.data))
          .catch(console.error);
      });
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  /* Close notification dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotifClick = () => {
    const next = !notifOpen;
    setNotifOpen(next);
    if (next && unreadCount > 0) {
      import('../api').then(({ default: api }) => {
        api.put('/api/notifications/read-all').then(() => {
          setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        }).catch(console.error);
      });
    }
  };

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
      <div className="navbar-profile" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <>
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button 
                onClick={handleNotifClick} 
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', 
                  color: 'var(--green-forest)', padding: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'red', borderRadius: '50%' }} />
                )}
              </button>

              {notifOpen && (
                <div style={{
                  position: 'absolute', top: '50px', right: 0, width: '320px', background: 'white',
                  border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 100, overflow: 'hidden', textAlign: 'left', color: '#333'
                }}>
                  <div style={{ padding: '12px 16px', background: '#f9f9f9', borderBottom: '1px solid #eee', fontWeight: '600' }}>
                    Notifications
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '16px', textAlign: 'center', color: '#888', fontSize: '14px' }}>No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} style={{ 
                          padding: '12px 16px', 
                          borderBottom: '1px solid #eee',
                          background: n.isRead ? 'white' : '#f0fdf4',
                          fontSize: '14px',
                          lineHeight: '1.4'
                        }}>
                          {n.message}
                          <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                            {new Date(n.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Logged-in: show avatar + go to dashboard */}
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
          </>
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
