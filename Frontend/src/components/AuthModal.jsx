import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }) {
  const [mode, setMode] = useState(defaultMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  // Reset form when switching mode
  useEffect(() => {
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setSuccess(false);
  }, [mode]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setError('');
      setSuccess(false);
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, defaultMode]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      setSuccess(true);
      setTimeout(() => {
        onClose();
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      // Axios error → err.response.data.message; or plain Error
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="auth-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'login' ? 'Sign in to PetPulse' : 'Create your PetPulse account'}
    >
      <div className={`auth-card ${success ? 'auth-card--success' : ''}`}>

        {/* Close button */}
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span>🐾</span>
          </div>
          <h2 className="auth-title">
            {success
              ? 'Welcome to PetPulse!'
              : mode === 'login'
              ? 'Welcome Back'
              : 'Create Account'}
          </h2>
          <p className="auth-subtitle">
            {success
              ? 'Redirecting you to your dashboard…'
              : mode === 'login'
              ? 'Sign in to manage your pets and appointments'
              : 'Join thousands of pet owners who trust PetPulse'}
          </p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="auth-success">
            <div className="auth-success-icon">✓</div>
          </div>
        ) : (
          <>
            {/* Toggle */}
            <div className="auth-toggle">
              <button
                className={`auth-toggle-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
                type="button"
                id="auth-login-tab"
              >
                Sign In
              </button>
              <button
                className={`auth-toggle-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => setMode('register')}
                type="button"
                id="auth-register-tab"
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit} noValidate autoComplete="off">
              {/* Name field – register only */}
              {mode === 'register' && (
                <div className="auth-field">
                  <label className="auth-label" htmlFor="auth-name">Full Name</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="auth-name"
                      ref={mode === 'register' ? firstInputRef : undefined}
                      className="auth-input"
                      type="text"
                      placeholder="e.g. Harsha Vidath"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-email">Email Address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7l-10 7L2 7" />
                    </svg>
                  </span>
                  <input
                    id="auth-email"
                    ref={mode === 'login' ? firstInputRef : undefined}
                    className="auth-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    />
                </div>
              </div>

              {/* Password */}
              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-password">Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </span>
                  <input
                    id="auth-password"
                    className="auth-input auth-input--password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'register' ? 'At least 6 characters' : 'Your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password – login only */}
              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: '-8px' }}>
                  <button type="button" className="auth-forgot">Forgot password?</button>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="auth-error" role="alert">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
                id="auth-submit-btn"
              >
                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>



            <p className="auth-switch">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="auth-switch-btn"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
