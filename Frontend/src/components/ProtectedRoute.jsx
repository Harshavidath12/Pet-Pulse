import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div className="auth-spinner" />
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading PetPulse…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ openAuth: true, from: location }} replace />;
  }

  return children;
}
