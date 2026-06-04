import { useState } from 'react';
import api from '../api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the privacy policy to continue.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/api/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setAgreed(false);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      paddingTop: '120px',
      paddingBottom: '80px',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '60px',
      }}>
        
        {/* Left Column: Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            color: 'var(--text-primary)',
            margin: '0 0 10px 0'
          }}>Contact Info</h2>

          {/* Address */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={iconStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <h4 style={titleStyle}>PetPulse Clinic</h4>
              <p style={textStyle}>146/6, Medhanadha Mawatha,<br/>Pahala Bomiriya, Kaduwela</p>
              <a href="#" style={{ ...textStyle, color: 'var(--green-primary)', fontWeight: 600, textDecoration: 'none' }}>(see location)</a>
            </div>
          </div>

          {/* Phone */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={iconStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            </div>
            <div>
              <h4 style={titleStyle}>Phone</h4>
              <p style={textStyle}>General line: <span style={{ color: 'var(--green-primary)', fontWeight: 600 }}>072 600 9790</span></p>
              <p style={textStyle}>24hr Emergency line: <span style={{ color: 'var(--green-primary)', fontWeight: 600 }}>072 600 9790</span></p>
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={iconStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <h4 style={titleStyle}>Email</h4>
              <p style={{ ...textStyle, color: 'var(--green-primary)', fontWeight: 600 }}>harshithavidath@gmail.com</p>
            </div>
          </div>

          {/* Office Hours */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={iconStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h4 style={titleStyle}>Office Hours</h4>
              <p style={textStyle}>Mon-Sun 8:30 am – 9:00 pm</p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            color: 'var(--text-primary)',
            margin: '0 0 24px 0'
          }}>Need help? Send us a message</h2>

          {success && (
            <div style={{ background: '#f0fdf4', color: '#166534', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #bbf7d0' }}>
              <strong>Message Sent!</strong> We'll get back to you as soon as possible.
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <input
                type="text"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={inputStyles}
              />
              <input
                type="email"
                placeholder="Your e-mail"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={inputStyles}
              />
            </div>
            
            <textarea
              placeholder="Your message"
              required
              rows="6"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              style={{ ...inputStyles, resize: 'vertical' }}
            ></textarea>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: '1.4' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: '3px', accentColor: 'var(--green-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span>
                I agree that my submitted data is being collected and stored. For further details on handling user data, see our <a href="/privacy" style={{ color: 'var(--green-primary)', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--gradient-green)',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                alignSelf: 'flex-start',
                marginTop: '10px',
                boxShadow: '0 8px 16px rgba(30, 86, 49, 0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

const iconStyle = {
  color: 'var(--green-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '2px'
};

const titleStyle = {
  margin: '0 0 4px 0',
  fontSize: '16px',
  color: 'var(--text-primary)',
  fontWeight: '700'
};

const textStyle = {
  margin: '0 0 4px 0',
  fontSize: '14px',
  color: 'var(--text-secondary)',
  lineHeight: '1.5'
};

const inputStyles = {
  flex: 1,
  padding: '16px 20px',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
  background: '#f1f5f9', // Light gray background matching the image
  fontFamily: 'inherit',
  fontSize: '14px',
  color: 'var(--text-primary)',
  outline: 'none',
  transition: 'border-color 0.2s, background 0.2s',
};
