import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Our Services', to: '/services' },
    { label: 'Blog & Tips', to: '/blog' },
    { label: 'Book Appointment', to: '/appointments' },
  ];

  const services = [
    { label: 'General Checkup', to: '/services' },
    { label: 'Vaccinations', to: '/services' },
    { label: 'Dental Care', to: '/services' },
    { label: 'Surgery & Procedures', to: '/services' },
    { label: 'Pet Grooming', to: '/services' },
    { label: 'Emergency Care', to: '/services' },
  ];

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-icon">🐾</div>
            <span className="footer-logo-text">PetPulse</span>
          </div>
          <p className="footer-brand-desc">
            Sri Lanka's most trusted veterinary care destination. We treat every animal as family,
            combining modern medicine with genuine compassion.
          </p>
          <div className="footer-socials">
            {[
              { icon: 'f', label: 'Facebook', href: '#' },
              { icon: '𝕏', label: 'Twitter', href: '#' },
              { icon: 'in', label: 'Instagram', href: '#' },
              { icon: '▶', label: 'YouTube', href: '#' },
            ].map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="social-btn"
                aria-label={label}
                title={label}
              >
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3 className="footer-col-title">Quick Links</h3>
          <nav className="footer-links">
            {quickLinks.map(({ label, to }) => (
              <Link key={label} to={to} className="footer-link">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Services */}
        <div className="footer-col">
          <h3 className="footer-col-title">Our Services</h3>
          <nav className="footer-links">
            {services.map(({ label, to }) => (
              <Link key={label} to={to} className="footer-link">
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h3 className="footer-col-title">Contact Us</h3>

          <div className="footer-contact-item">
            <div className="footer-contact-icon">📍</div>
            <div className="footer-contact-text">
              <span className="footer-contact-label">Address</span>
              <span className="footer-contact-value">
                146/6, Medhanadha Mawatha<br />
                Pahala Bomiriya, Kaduwela
              </span>
            </div>
          </div>

          <div className="footer-contact-item">
            <div className="footer-contact-icon">📞</div>
            <div className="footer-contact-text">
              <span className="footer-contact-label">Phone</span>
              <span className="footer-contact-value">
                <a href="tel:0726009790" style={{ color: 'inherit' }}>0726009790</a><br />
                <a href="tel:0706625728" style={{ color: 'inherit' }}>0706625728</a>
              </span>
            </div>
          </div>

          <div className="footer-contact-item">
            <div className="footer-contact-icon">🕐</div>
            <div className="footer-contact-text">
              <span className="footer-contact-label">Working Hours</span>
              <span className="footer-contact-value">
                Mon – Sat: 8:00 AM – 7:00 PM<br />
                Sun: 9:00 AM – 2:00 PM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-bottom-text">
          © {currentYear} PetPulse. All rights reserved. Made with ❤️ for pets.
        </p>
        <div className="footer-bottom-links">
          <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
          <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
          <Link to="/contact" className="footer-bottom-link">Contact</Link>
        </div>
      </div>

      {/* Animated gradient bar */}
      <div className="footer-glow-bar" />
    </footer>
  );
}
