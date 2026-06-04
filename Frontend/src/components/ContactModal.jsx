import { useState } from 'react';
import api from '../api';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/api/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content contact-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="contact-modal-body">
          <div className="contact-info">
            <h2>Contact Info</h2>
            <div className="info-block">
              <strong>📍 PetPulse Clinic</strong>
              <p>146/6, Medhanadha Mawatha</p>
              <p>Pahala Bomiriya, Kaduwela</p>
            </div>
            <div className="info-block">
              <strong>📞 Phone</strong>
              <p>0726009790</p>
            </div>
            <div className="info-block">
              <strong>✉️ Email</strong>
              <p>info@petpulse.lk</p>
            </div>
            <div className="info-block">
              <strong>🕒 Office Hours</strong>
              <p>Mon-Sun 8:30 am - 9:00 pm</p>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Need help? Send us a message</h2>
            {success && <div className="success-msg">Message sent successfully! We will get back to you soon.</div>}
            {error && <div className="error-msg">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Your e-mail"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <textarea
                placeholder="Your message"
                rows="5"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree that my submitted data is being collected and stored.</span>
              </label>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
