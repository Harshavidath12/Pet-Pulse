import { useState, useRef, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminInquiries from './AdminInquiries';
import AdminAppointments from '../components/AdminAppointments';
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

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);



  /* ── Sidebar badges ── persisted in localStorage ── */
  const [petsBadge,  setPetsBadge]  = useState(() => readLS(LS_KEYS.pets,  2));
  const [apptsBadge, setApptsBadge] = useState(() => readLS(LS_KEYS.appts, 3));

  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      if (user?.role === 'admin') {
        navigate('/dashboard/inquiries', { replace: true });
      } else {
        navigate('/dashboard/overview', { replace: true });
      }
    }
  }, [location, navigate, user]);

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



  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = user?.role === 'admin' 
    ? [
        { path: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/dashboard/inquiries', label: 'Inquiries', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { path: '/dashboard/appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      ]
    : [
        { path: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { path: '/dashboard/overview', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { path: '/dashboard/pets', label: 'My Pets', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
        { path: '/dashboard/appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { path: '/dashboard/records', label: 'Medical Records', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
      ];

  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <div className="sidebar-mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`dashboard-sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <Link to="/" className="sidebar-logo" title="Back to Home" id="sidebar-home-link">
          <span className="sidebar-logo-icon">🐾</span>
          <span className="sidebar-logo-text">PetPulse</span>
        </Link>

        <nav className="sidebar-nav">
          {navLinks.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-nav-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon}/></svg>
              </span>
              <span className="sidebar-nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user?.avatar || user?.name?.[0] || 'U'}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name}</span>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout} aria-label="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="sidebar-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <div className="topbar-right">

            <div className="topbar-user-chip">
              <div className="topbar-user-avatar">{user?.avatar || user?.name?.[0] || 'U'}</div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <Routes>
            {user?.role === 'admin' ? (
              <>
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="appointments" element={<AdminAppointments />} />
              </>
            ) : (
              <>
                <Route path="overview" element={<Overview />} />
                <Route path="pets" element={<MyPets />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="records" element={<MedicalRecords />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
}
