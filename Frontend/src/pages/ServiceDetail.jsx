import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { servicesList } from './Services';
import { useAuth } from '../context/AuthContext';
import ContactModal from '../components/ContactModal';
import BookingModal from '../components/BookingModal';

export default function ServiceDetail({ onOpenAuth }) {
  const { serviceId } = useParams();
  const { user } = useAuth();
  
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Find the requested service
  const service = servicesList.find((s) => s.slug === serviceId);

  // Scroll to top when page loads or service changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  // If service not found, redirect back to services page
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="service-detail-page">
      <div className="service-detail-container">
        
        {/* Sidebar */}
        <aside className="service-sidebar fade-in-left">
          <h2 className="service-sidebar-title">Services</h2>
          <ul className="service-sidebar-list">
            {servicesList.map((srv) => (
              <li key={srv.slug}>
                <Link
                  to={`/services/${srv.slug}`}
                  className={`service-sidebar-link ${srv.slug === serviceId ? 'active' : ''}`}
                >
                  {srv.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="service-main-content fade-in-up">
          <div className="service-main-img-wrapper">
            <img src={service.img} alt={service.title} className="service-main-img" />
          </div>
          
          <h1 className="service-main-title">{service.title}</h1>
          
          <div className="service-main-description">
            <p>{service.description}</p>
          </div>
          
          {user ? (
            <button className="btn btn-primary service-contact-btn" onClick={() => setIsBookingOpen(true)}>
              Book an Appointment
            </button>
          ) : (
            <button className="btn btn-primary service-contact-btn" onClick={() => setIsContactOpen(true)}>
              Contact us
            </button>
          )}
        </main>
      </div>

      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        defaultServiceType={service.title}
      />
    </div>
  );
}
