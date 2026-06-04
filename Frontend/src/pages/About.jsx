import React from 'react';

export default function About() {
  return (
    <div className="about-page">
      {/* Top Section */}
      <section className="about-top">
        <h3 className="about-subtitle">About Us</h3>
        <h1 className="about-title">
          At PetPulse, we have a 25 year history of<br />
          connecting, caring and curing your<br />
          companion animals.
        </h1>
        
        <p className="about-description">
          Bound by an organizational culture - one that fosters respect and compassion to all animals and their human caretakers -
          PetPulse sets itself apart from other veterinary services in the country by treating your companion animals with the kind of
          care, love and kindness we show towards our own fur babies.
        </p>

        <div className="about-slogan">
          <p>Because pets are family.</p>
          <p>At PetPulse, we understand this truth.</p>
          <p>At PetPulse, we wholeheartedly agree.</p>
        </div>

        <img src="/about_us_pets.png" alt="Pets looking over ledge" className="about-pets-img" />
      </section>

      {/* Bottom Section */}
      <section className="about-bottom">
        <div className="about-bottom-container">
          {/* Left Column: Principles */}
          <div className="about-principles">
            <h2 className="section-heading" style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>Our Principles</h2>
            
            <div className="principle-block">
              <h1 className="principle-title">Vision</h1>
              <p>To foster a world where the symbiotic bond between humans, animals, and the environment is valued & celebrated.</p>
            </div>

            <div className="principle-block">
              <h1 className="principle-title">Mission</h1>
              <p>
                To be the leading veterinary clinic in Sri Lanka and beyond, dedicated to
                enhancing the human-animal bond through exceptional medical care,
                innovative services, and community-driven initiatives. We aspire to
                achieve sustainable growth with minimal environmental footprint,
                empower our employees, and expand our reach globally, all while
                maintaining the highest standards of veterinary excellence.
              </p>
            </div>
          </div>

          {/* Right Column: Core Values */}
          <div className="about-values">
            <h1 className="section-heading" style={{ fontSize: '32px', fontFamily: 'var(--font-display)' }}>Our Core Values</h1>

            <div className="value-item">
              <div className="value-bar-container">
                <div className="value-bar" style={{ width: '100%' }}></div>
                <span className="value-percent">100%</span>
              </div>
              <h4 className="value-title">Compassion</h4>
              <p className="value-desc">We are animal lovers and pet owners ourselves so we understand the power of providing treatment in a kind and empathetic manner. This approach filters through everything we do.</p>
            </div>

            <div className="value-item">
              <div className="value-bar-container">
                <div className="value-bar" style={{ width: '100%' }}></div>
                <span className="value-percent">100%</span>
              </div>
              <h4 className="value-title">Integrity</h4>
              <p className="value-desc">We are obsessed with doing the right thing. We respect the trust placed in us by our patients' owners and so undertake to be transparent and fair.</p>
            </div>

            <div className="value-item">
              <div className="value-bar-container">
                <div className="value-bar" style={{ width: '100%' }}></div>
                <span className="value-percent">100%</span>
              </div>
              <h4 className="value-title">Responsibility</h4>
              <p className="value-desc">We are serious about our responsibility to our patients and their owners. So we are always doing our best in providing world-class treatment.</p>
            </div>

            <div className="value-item">
              <div className="value-bar-container">
                <div className="value-bar" style={{ width: '100%' }}></div>
                <span className="value-percent">100%</span>
              </div>
              <h4 className="value-title">Excellence</h4>
              <p className="value-desc">We are dedicated to providing outstanding excellence in all our services.</p>
            </div>

            <div className="value-item">
              <div className="value-bar-container">
                <div className="value-bar" style={{ width: '100%' }}></div>
                <span className="value-percent">100%</span>
              </div>
              <h4 className="value-title">Teamwork</h4>
              <p className="value-desc">We celebrate the unique backgrounds, specialisations and experiences of our diverse team. We function as a holistic and supportive community aligned by mutual respect for each other, the animals we care for and their loving owners.</p>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .about-page {
          background-color: #ffffff;
          font-family: var(--font-body);
          padding-top: 100px;
        }

        /* Top Section */
        .about-top {
          text-align: center;
          padding: 0 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .about-subtitle {
          font-family: var(--font-display);
          font-size: 20px;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .about-title {
          font-family: var(--font-display);
          font-size: 42px;
          line-height: 1.2;
          color: #2c2c2c;
          margin-bottom: 40px;
        }

        .about-description {
          font-size: 14px;
          line-height: 1.8;
          color: #555;
          max-width: 800px;
          margin: 0 auto 30px auto;
        }

        .about-slogan {
          font-size: 18px;
          color: #333;
          margin-bottom: 40px;
        }
        
        .about-slogan p {
          margin: 5px 0;
        }

        .about-pets-img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
          margin-bottom: -5px; /* sit flush on bottom edge if needed */
          mix-blend-mode: multiply; /* Removes the grey/silver box background */
        }

        /* Bottom Section */
        .about-bottom {
          padding: 80px 20px;
          border-top: 1px solid #eee;
        }

        .about-bottom-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
        }

        @media (max-width: 900px) {
          .about-bottom-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* Left Column: Principles */
        .principle-block {
          margin-top: 40px;
        }

        .principle-title {
          font-family: var(--font-display);
          font-size: 32px;
          color: #1a1a1a;
          margin-bottom: 15px;
        }

        .principle-block p {
          font-size: 14px;
          line-height: 1.8;
          color: #444;
        }

        /* Right Column: Values */
        .value-item {
          margin-bottom: 30px;
        }

        .value-bar-container {
          position: relative;
          height: 2px;
          background-color: #eee;
          margin-bottom: 8px;
          margin-top: 25px;
        }

        .value-bar {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background-color: #9c27b0; /* purple accent matching reference image */
        }

        .value-percent {
          position: absolute;
          right: 0;
          top: -20px;
          font-size: 12px;
          font-weight: bold;
          color: #9c27b0;
        }

        .value-title {
          color: #9c27b0;
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .value-desc {
          font-size: 13px;
          line-height: 1.6;
          color: #555;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
