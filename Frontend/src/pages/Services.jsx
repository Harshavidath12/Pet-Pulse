import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const servicesList = [
  { slug: 'pain-control', title: 'Comprehensive Pain Control', img: '/services/user_pain_control.jpg', delay: 100,
    description: 'There is a difference between experiencing pain as a human versus experiencing pain as an animal: from an evolutionary standpoint, prior to the modern age of domestication, the early ancestors of our companion animals knew that showing pain would mean being killed and eaten by predators. Thus, the signs of pain in animals are very subtle, requiring trained eyes and hands to recognize and treat it.' },
  { slug: 'anesthesia', title: 'Advanced Anesthesia', img: '/services/surgery.png', delay: 200,
    description: 'We utilize state-of-the-art anesthetic protocols tailored to your pet’s individual needs. Our dedicated team closely monitors vitals throughout any procedure to ensure the highest safety and comfort standards.' },
  { slug: 'surgery', title: 'Companion Animal Surgery', img: '/services/hero_dog.png', delay: 300,
    description: 'From routine spays and neuters to complex orthopedic and soft tissue surgeries, our surgical suite is equipped with advanced technology. We prioritize pain management and a smooth recovery for every patient.' },
  { slug: 'medical-services', title: 'Companion Animal Medical Services', img: '/services/wellness.png', delay: 400,
    description: 'Our comprehensive medical services cover everything from internal medicine and dermatology to cardiology and endocrinology, ensuring your pet receives holistic and thorough care at every stage of life.' },
  { slug: 'dental', title: 'Dental Services', img: '/services/user_dental.png', delay: 500,
    description: 'Oral health is crucial to your pet’s overall well-being. We offer comprehensive dental cleanings, extractions, and oral surgery using digital dental radiography to safely diagnose and treat hidden dental diseases.' },
  { slug: 'equine', title: 'Equine Services', img: '/services/user_equine.png', delay: 600,
    description: 'We provide specialized ambulatory and in-clinic care for horses, encompassing routine wellness, lameness evaluations, reproductive services, and advanced diagnostics to keep your equine companions at their peak performance.' },
  { slug: 'laboratory', title: 'Laboratory Services', img: '/services/wellness.png', delay: 700,
    description: 'Our in-house laboratory allows us to perform a wide array of diagnostic tests rapidly, providing immediate answers during emergencies and thorough screenings for routine wellness visits.' },
  { slug: 'emergency', title: '24 Hour Emergency Service', img: '/services/emergency.png', delay: 800,
    description: 'Emergencies don’t wait for business hours. Our dedicated team is available 24/7 to provide critical care, intensive monitoring, and immediate life-saving interventions when your pet needs it most.' },
];

export default function Services({ onOpenAuth }) {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            <Link to={`/services/${srv.slug}`} key={idx} className="service-card" style={{ animationDelay: `${srv.delay}ms`, textDecoration: 'none' }}>
              <div className="service-card-img-wrapper">
                <img src={srv.img} alt={srv.title} />
              </div>
              <div className="service-card-content">
                <h3>{srv.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
