import { useEffect } from 'react';

export default function Services({ onOpenAuth }) {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const servicesList = [
    { title: 'Comprehensive Pain Control', img: '/services/user_pain_control.jpg', delay: 100 },
    { title: 'Advanced Anesthesia', img: '/services/surgery.png', delay: 200 },
    { title: 'Companion Animal Surgery', img: '/services/hero_dog.png', delay: 300 },
    { title: 'Companion Animal Medical Services', img: '/services/wellness.png', delay: 400 },
    { title: 'Dental Services', img: '/services/user_dental.png', delay: 500 },
    { title: 'Equine Services', img: '/services/user_equine.png', delay: 600 },
    { title: 'Laboratory Services', img: '/services/wellness.png', delay: 700 },
    { title: '24 Hour Emergency Service', img: '/services/emergency.png', delay: 800 },
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="services-hero-content">
          <div className="services-hero-image-wrapper fade-in-up">
            <div className="services-hero-blob"></div>
            <img src="/services/hero_dog.png" alt="Veterinary Care Dog" className="services-hero-img" />
          </div>
          <div className="services-hero-text fade-in-up" style={{ animationDelay: '200ms' }}>
            <span className="section-subtitle">Animal Care</span>
            <h1 className="section-title">Our Services</h1>
            <p>
              At PetPulse, we believe our customers view their animal friends as extensions of their family. This is why our suite of services, including wellness programmes and disease diagnosis and treatment, are designed to connect, care and cure your companions.
            </p>
            <p>
              We offer the following services for companion and exotic animals. These include wellness programs as well as disease diagnosis and treatment, including surgery, dentistry and diagnostic imaging (X-Ray/Scan).
            </p>
            <button className="btn btn-primary" onClick={() => onOpenAuth('register')} style={{ marginTop: '20px' }}>
              Book an Appointment or Call us
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="services-grid-section">
        <div className="services-grid-header fade-in-up">
          <span className="section-subtitle">Services</span>
          <h2 className="section-title">What We Offer</h2>
        </div>
        
        <div className="services-grid">
          {servicesList.map((srv, idx) => (
            <div key={idx} className="service-card" style={{ animationDelay: `${srv.delay}ms` }}>
              <div className="service-card-img-wrapper">
                <img src={srv.img} alt={srv.title} />
              </div>
              <div className="service-card-content">
                <h3>{srv.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
