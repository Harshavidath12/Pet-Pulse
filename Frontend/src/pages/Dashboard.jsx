import { useState, useRef, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Overview from './dashboard/Overview';
import MyPets from './dashboard/MyPets';
import Appointments from './dashboard/Appointments';
import MedicalRecords from './dashboard/MedicalRecords';

/* ── helpers: persist badge state in localStorage ── */
const LS_KEYS = {
  notif:  'pp_notif_count',
  pets:   'pp_badge_pets',
  appts:  'pp_badge_appts',
};

function readLS(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ── Nav icon SVGs ── */
const Icons = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  pets: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/>
      <circle cx="3" cy="11" r="2"/><circle cx="21" cy="11" r="2"/>
      <ellipse cx="12" cy="16" rx="5.5" ry="4.5"/>
    </svg>
  ),
  appointments: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <circle cx="12" cy="16" r="2" fill="currentColor"/>
    </svg>
  ),
  records: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8z"/>
      <polyline points="17 3 17 8 12 8"/><line x1="9" y1="12" x2="15" y2="12"/>
      <line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  ),
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Notification bell ── persisted in localStorage ── */
  const [notifCount, setNotifCount] = useState(() => readLS(LS_KEYS.notif, 3));
  const [notifOpen,  setNotifOpen]  = useState(false);
  const notifRef = useRef(null);

  /* ── Sidebar badges ── persisted in localStorage ── */
  const [petsBadge,  setPetsBadge]  = useState(() => readLS(LS_KEYS.pets,  2));
  const [apptsBadge, setApptsBadge] = useState(() => readLS(LS_KEYS.appts, 3));

  /* Clear sidebar badge when user visits the corresponding page */
  useEffect(() => {
    if (location.pathname === '/dashboard/pets' && petsBadge > 0) {
      setPetsBadge(0);
      writeLS(LS_KEYS.pets, 0);
    }
    if (location.pathname === '/dashboard/appointments' && apptsBadge > 0) {
      setApptsBadge(0);
      writeLS(LS_KEYS.appts, 0);
    }
  }, [location.pathname]); // eslint-disable-line

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
    if (next && notifCount > 0) {
      setNotifCount(0);
      writeLS(LS_KEYS.notif, 0); // persist — survives refresh
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* Dynamic nav items — badges come from state */
  const navItems = [
    { to: '/',                                  label: 'Home',            icon: Icons.home,         badge: 0           },
    { to: '/dashboard',              end: true, label: 'Dashboard',      icon: Icons.dashboard,    badge: 0           },
    { to: '/dashboard/pets',                    label: 'My Pets',         icon: Icons.pets,         badge: petsBadge   },
    { to: '/dashboard/appointments',            label: 'Appointments',    icon: Icons.appointments, badge: apptsBadge  },
    { to: '/dashboard/records',                 label: 'Medical Records', icon: Icons.records,      badge: 0           },
  ];

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <Link to="/" className="sidebar-logo" title="Back to Home" id="sidebar-home-link">
          <span className="sidebar-logo-icon">🐾</span>
          <span className="sidebar-logo-text">PetPulse</span>
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"
            style={{ marginLeft: 'auto', flexShrink: 0 }}
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </Link>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section-label">Main Menu</div>
          {navItems.map(({ to, end, label, icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
              id={`sidebar-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="sidebar-nav-icon">{icon}</span>
              <span className="sidebar-nav-label">{label}</span>
              {badge > 0 && <span className="sidebar-nav-badge">{badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
          <div className="sidebar-nav-section-label">Support</div>
          <button className="sidebar-nav-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="sidebar-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <span className="sidebar-nav-label">Help &amp; Support</span>
          </button>
          <button className="sidebar-nav-item" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="sidebar-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </span>
            <span className="sidebar-nav-label">Settings</span>
          </button>
        </nav>

        {/* User at bottom */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.avatar || user?.name?.[0] || 'U'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name}</span>
            <span className="sidebar-user-email">{user?.email}</span>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            aria-label="Logout"
            title="Sign out"
            id="logout-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="dashboard-main">
        {/* Top bar */}
        <header className="dashboard-topbar">
          <button
            className="sidebar-hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            id="sidebar-toggle"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div className="topbar-breadcrumb">
            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--green-forest)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              PetPulse
            </Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>Dashboard</span>
          </div>

          <div className="topbar-right">
            {/* ── Notification bell ── */}
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                className="topbar-icon-btn"
                aria-label="Notifications"
                id="notifications-btn"
                onClick={handleNotifClick}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                {notifCount > 0 && (
                  <span className="topbar-badge">{notifCount}</span>
                )}
              </button>

              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-dropdown-header">
                    <span className="notif-dropdown-title">Notifications</span>
                    <button className="notif-mark-read" onClick={() => setNotifOpen(false)}>
                      Close
                    </button>
                  </div>
                  <ul className="notif-list">
                    {[
                      { icon: '📅', text: 'Annual Checkup for Max on Jun 15', time: '2 hours ago' },
                      { icon: '💉', text: "Luna's vaccination is due soon",   time: '1 day ago'   },
                      { icon: '✅', text: 'Appointment confirmed — Dental Cleaning', time: '2 days ago' },
                    ].map((n, i) => (
                      <li key={i} className="notif-item">
                        <span className="notif-item-icon">{n.icon}</span>
                        <div className="notif-item-body">
                          <p className="notif-item-text">{n.text}</p>
                          <span className="notif-item-time">{n.time}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* User chip */}
            <div className="topbar-user-chip">
              <div className="topbar-user-avatar">{user?.avatar || user?.name?.[0] || 'U'}</div>
              <span className="topbar-user-name">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="dashboard-content">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="pets"         element={<MyPets />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="records"      element={<MedicalRecords />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
