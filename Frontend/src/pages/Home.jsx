import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ─── Animated Dog SVG ─── */
function AnimatedDog() {
  return (
    <svg
      viewBox="0 0 400 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', maxWidth: 380 }}
      aria-label="Animated dog illustration"
    >
      <defs>
        <radialGradient id="bodyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c97b3a" />
          <stop offset="100%" stopColor="#8b4a12" />
        </radialGradient>
        <radialGradient id="bellyGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8a865" />
          <stop offset="100%" stopColor="#c97b3a" />
        </radialGradient>
        <radialGradient id="eyeGrad" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#5c3d1e" />
          <stop offset="100%" stopColor="#1a0a00" />
        </radialGradient>
        <filter id="softShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="rgba(0,0,0,0.4)" />
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="200" cy="355" rx="110" ry="14" fill="rgba(0,0,0,0.25)">
        <animate attributeName="rx" values="110;120;110" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.25;0.15;0.25" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* ─── TAIL ─── */}
      <g style={{ transformOrigin: '270px 240px' }}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-10 270 240; 30 270 240; -10 270 240"
          dur="0.6s"
          repeatCount="indefinite"
        />
        <path
          d="M270 240 Q310 220 340 190 Q355 175 345 162 Q335 150 320 165 Q305 175 295 200 Q280 225 270 240Z"
          fill="url(#bodyGrad)"
          filter="url(#softShadow)"
        />
        {/* Tail tip */}
        <circle cx="340" cy="183" r="14" fill="#e8a865" />
      </g>

      {/* ─── BODY ─── */}
      <ellipse cx="195" cy="250" rx="98" ry="72" fill="url(#bodyGrad)" filter="url(#softShadow)" />
      {/* Belly patch */}
      <ellipse cx="195" cy="268" rx="52" ry="38" fill="url(#bellyGrad)" opacity="0.9" />

      {/* ─── HIND LEGS ─── */}
      {/* Right hind */}
      <rect x="242" y="298" width="38" height="52" rx="19" fill="url(#bodyGrad)" />
      <ellipse cx="261" cy="353" rx="22" ry="12" fill="#8b4a12" />
      {/* Left hind */}
      <rect x="130" y="298" width="38" height="52" rx="19" fill="#a36328" />
      <ellipse cx="149" cy="353" rx="22" ry="12" fill="#7a3f0f" />

      {/* ─── FRONT LEGS ─── (with breathing animation) */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-3; 0,0"
          dur="4s"
          repeatCount="indefinite"
        />
        {/* Right front */}
        <rect x="220" y="295" width="35" height="58" rx="17" fill="url(#bodyGrad)" />
        <ellipse cx="237" cy="355" rx="21" ry="11" fill="#8b4a12" />
        {/* Left front */}
        <rect x="115" y="295" width="35" height="58" rx="17" fill="#a36328" />
        <ellipse cx="132" cy="355" rx="21" ry="11" fill="#7a3f0f" />
      </g>

      {/* ─── NECK ─── */}
      <ellipse cx="175" cy="198" rx="46" ry="38" fill="url(#bodyGrad)" />
      <ellipse cx="175" cy="192" rx="36" ry="28" fill="#c97b3a" />

      {/* ─── HEAD ─── */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 2,-2; 0,0; -2,-1; 0,0"
          dur="3s"
          repeatCount="indefinite"
        />
        {/* Head base */}
        <ellipse cx="175" cy="155" rx="72" ry="62" fill="url(#bodyGrad)" filter="url(#softShadow)" />

        {/* Forehead patch */}
        <ellipse cx="175" cy="138" rx="42" ry="30" fill="#a36328" opacity="0.5" />

        {/* ─── EARS ─── */}
        {/* Right ear */}
        <g style={{ transformOrigin: '235px 115px' }}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 235 115; 8 235 115; 0 235 115; -3 235 115; 0 235 115"
            dur="2s"
            repeatCount="indefinite"
          />
          <path
            d="M225 108 Q255 82 268 110 Q260 140 238 145 Q218 140 225 108Z"
            fill="#7a3f0f"
          />
          <path
            d="M228 112 Q252 90 263 114 Q255 136 238 140 Q223 136 228 112Z"
            fill="#a36328"
          />
        </g>
        {/* Left ear */}
        <g style={{ transformOrigin: '115px 115px' }}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 115 115; -8 115 115; 0 115 115; 3 115 115; 0 115 115"
            dur="2s"
            repeatCount="indefinite"
            begin="0.5s"
          />
          <path
            d="M125 108 Q95 82 82 110 Q90 140 112 145 Q132 140 125 108Z"
            fill="#7a3f0f"
          />
          <path
            d="M122 112 Q98 90 87 114 Q95 136 112 140 Q127 136 122 112Z"
            fill="#a36328"
          />
        </g>

        {/* ─── EYES ─── */}
        {/* Right eye */}
        <g>
          <circle cx="196" cy="152" r="13" fill="url(#eyeGrad)" />
          <circle cx="196" cy="152" r="9" fill="#2a1200" />
          <circle cx="196" cy="152" r="5" fill="#0a0500" />
          {/* Shine */}
          <circle cx="200" cy="148" r="3" fill="white" opacity="0.9" filter="url(#glow)" />
          <circle cx="193" cy="155" r="1.5" fill="white" opacity="0.5" />
          {/* Blink */}
          <rect x="183" y="150" width="26" height="0" rx="6" fill="#a36328">
            <animate attributeName="height" values="0;14;0" dur="4s" begin="2s" repeatCount="indefinite" />
            <animate attributeName="y" values="150;145;150" dur="4s" begin="2s" repeatCount="indefinite" />
          </rect>
        </g>
        {/* Left eye */}
        <g>
          <circle cx="154" cy="152" r="13" fill="url(#eyeGrad)" />
          <circle cx="154" cy="152" r="9" fill="#2a1200" />
          <circle cx="154" cy="152" r="5" fill="#0a0500" />
          {/* Shine */}
          <circle cx="158" cy="148" r="3" fill="white" opacity="0.9" filter="url(#glow)" />
          <circle cx="151" cy="155" r="1.5" fill="white" opacity="0.5" />
          {/* Blink */}
          <rect x="141" y="150" width="26" height="0" rx="6" fill="#a36328">
            <animate attributeName="height" values="0;14;0" dur="4s" begin="2s" repeatCount="indefinite" />
            <animate attributeName="y" values="150;145;150" dur="4s" begin="2s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Eyebrows */}
        <path d="M185 136 Q196 131 207 136" stroke="#6b3510" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d"
            values="M185 136 Q196 131 207 136; M185 133 Q196 130 207 133; M185 136 Q196 131 207 136"
            dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M143 136 Q154 131 165 136" stroke="#6b3510" strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="d"
            values="M143 136 Q154 131 165 136; M143 133 Q154 130 165 133; M143 136 Q154 131 165 136"
            dur="3s" repeatCount="indefinite" />
        </path>

        {/* ─── SNOUT ─── */}
        <ellipse cx="175" cy="178" rx="32" ry="22" fill="#c97b3a" />
        <ellipse cx="175" cy="176" rx="26" ry="16" fill="#d8914a" />

        {/* Nose */}
        <ellipse cx="175" cy="168" rx="13" ry="9" fill="#1a0a00" />
        <ellipse cx="172" cy="165" rx="4" ry="2.5" fill="#3a2010" opacity="0.6" />

        {/* Mouth */}
        <path d="M175 177 Q165 185 158 183" stroke="#8b4a12" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M175 177 Q185 185 192 183" stroke="#8b4a12" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* ─── TONGUE ─── (licking animation) */}
        <g>
          <animate attributeName="opacity" values="0;0;1;1;0;0" dur="6s" repeatCount="indefinite" />
          <ellipse cx="175" cy="190" rx="9" ry="12" fill="#e84a6a" />
          <path d="M166 190 Q175 202 184 190" fill="#e84a6a" />
          <ellipse cx="175" cy="196" rx="4" ry="5" fill="#d03058" opacity="0.5" />
        </g>
      </g>

      {/* ─── COLLAR ─── */}
      <rect x="140" y="210" width="70" height="16" rx="8" fill="#ff6b6b">
        <animate attributeName="fill" values="#ff6b6b;#ffd93d;#4ecdc4;#ff6b6b" dur="6s" repeatCount="indefinite" />
      </rect>
      <circle cx="175" cy="228" r="8" fill="#c0c0c0" />
      <ellipse cx="175" cy="228" rx="5" ry="3" fill="#a0a0a0" />
      {/* Collar studs */}
      <circle cx="152" cy="218" r="3.5" fill="#ffd700" opacity="0.8" />
      <circle cx="198" cy="218" r="3.5" fill="#ffd700" opacity="0.8" />

      {/* ─── SPOTS ─── */}
      <circle cx="225" cy="240" r="8" fill="#7a3f0f" opacity="0.35" />
      <circle cx="155" cy="255" r="6" fill="#7a3f0f" opacity="0.3" />

      {/* ─── PAWS DETAIL ─── */}
      {/* Toe lines on right front paw */}
      <path d="M230 354 L226 360 M237 356 L237 362 M244 354 L248 360" stroke="#7a3f0f" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/* ─── Paw Print Icon ─── */
function PawPrint({ size = 24, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="3" cy="11" r="2" />
      <circle cx="21" cy="11" r="2" />
      <ellipse cx="12" cy="16" rx="5.5" ry="4.5" />
    </svg>
  );
}

/* ─── Counter animation hook ─── */
function useCounter(target, duration = 2000) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            el.textContent = target + (target >= 1000 ? '+' : target === 100 ? '%' : '+');
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(start) + (target >= 1000 ? '+' : '+');
          }
        }, 16);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return ref;
}

/* ─── Stat Counter Component ─── */
function StatCounter({ target, label, suffix = '+' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const totalFrames = 60;
        const increment = target / totalFrames;
        let frame = 0;
        const timer = setInterval(() => {
          frame++;
          start += increment;
          if (frame >= totalFrames) {
            el.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(start).toLocaleString() + suffix;
          }
        }, 30);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix]);

  return <span className="stats-strip-number" ref={ref}>0{suffix}</span>;
}

/* ═══════════════════════════════
   HOME PAGE
   ═══════════════════════════════ */
export default function Home({ onOpenAuth }) {
  const petCategories = [
    { icon: '🐕', label: 'Dogs',    count: '120+ breeds',  color: '#2d7a4f', glow: 'rgba(45,122,79,0.15)',   gradient: 'linear-gradient(135deg,rgba(45,122,79,0.07),transparent)' },
    { icon: '🐈', label: 'Cats',    count: '80+ breeds',   color: '#40916c', glow: 'rgba(64,145,108,0.15)',  gradient: 'linear-gradient(135deg,rgba(64,145,108,0.07),transparent)' },
    { icon: '🐦', label: 'Birds',   count: '50+ species',  color: '#e9a84c', glow: 'rgba(233,168,76,0.2)',   gradient: 'linear-gradient(135deg,rgba(233,168,76,0.07),transparent)' },
    { icon: '🐇', label: 'Rabbits', count: '30+ breeds',   color: '#52b788', glow: 'rgba(82,183,136,0.2)',   gradient: 'linear-gradient(135deg,rgba(82,183,136,0.07),transparent)' },
    { icon: '🦎', label: 'Exotics', count: 'All welcome',  color: '#d4704a', glow: 'rgba(212,112,74,0.15)',  gradient: 'linear-gradient(135deg,rgba(212,112,74,0.07),transparent)' },
  ];

  const doctors = [
    {
      emoji: '👩‍⚕️',
      name: 'Dr. Amara Perera',
      title: 'Chief Veterinarian',
      specialty: 'Small animal medicine & surgery specialist with expertise in oncology and internal medicine.',
      tags: ['Surgery', 'Oncology', 'Internal Medicine'],
      experience: '14 years of experience',
      degree: 'BVSc (Hons) · MRCVS · MVS (Colombo)',
    },
    {
      emoji: '👨‍⚕️',
      name: 'Dr. Rohan Silva',
      title: 'Senior Veterinary Surgeon',
      specialty: 'Specialist in orthopedics, exotic animal medicine, and advanced diagnostic imaging.',
      tags: ['Orthopedics', 'Exotics', 'Diagnostics'],
      experience: '11 years of experience',
      degree: 'BVSc · MVS · SLVC Certified',
    },
  ];

  const statsData = [
    { target: 5000, label: 'Pets Treated', suffix: '+' },
    { target: 15, label: 'Years of Care', suffix: '+' },
    { target: 98, label: 'Recovery Rate', suffix: '%' },
    { target: 12, label: 'Expert Vets', suffix: '+' },
  ];

  return (
    <main>
      {/* ═══ HERO SECTION ═══ */}
      <section className="hero" id="hero" aria-label="Hero section">
        {/* Animated background */}
        <div className="hero-bg-grid" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        {/* Decorative leaves */}
        <div className="hero-leaf hero-leaf-1">🌿</div>
        <div className="hero-leaf hero-leaf-2">🍃</div>
        <div className="hero-leaf hero-leaf-3">🌱</div>
        <div className="hero-leaf hero-leaf-4">🍀</div>
        <div className="hero-leaf hero-leaf-5">🌾</div>

        <div className="hero-content">
          {/* Text side */}
          <div className="hero-text">
            <span className="hero-badge">
              🐾 Sri Lanka's Premier Pet Care
            </span>

            <h1 className="hero-title">
              Where Every <span className="highlight">Paw</span> Finds<br />
              Perfect <span className="highlight">Care</span>
            </h1>

            <p className="hero-subtitle">
              At PetPulse, we combine cutting-edge veterinary medicine with heartfelt compassion.
              Your pet deserves nothing less than extraordinary — and we deliver it every single day.
            </p>

            <div className="hero-cta-group">
              <button
                className="btn-primary"
                id="book-appointment-btn"
                onClick={() => onOpenAuth?.('register')}
              >
                <PawPrint size={18} />
                Book Appointment
              </button>
              <Link to="/services" className="btn-secondary" id="explore-services-btn">
                Explore Services
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="hero-stats">
              {[
                { number: '5000+', label: 'Happy Pets' },
                { number: '15+', label: 'Years Active' },
                { number: '98%', label: 'Recovery Rate' },
              ].map(({ number, label }) => (
                <div key={label} className="stat-item">
                  <span className="stat-number">{number}</span>
                  <span className="stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dog animation side */}
          <div className="hero-animation">
            <div className="dog-scene">
              <div className="dog-ring" />
              <div className="dog-ring dog-ring-2" />

              {/* Floating paw prints */}
              <div className="paw-float paw-1" style={{ color: '#2d7a4f' }}>
                <PawPrint size={26} />
              </div>
              <div className="paw-float paw-2" style={{ color: '#e9a84c' }}>
                <PawPrint size={20} />
              </div>
              <div className="paw-float paw-3" style={{ color: '#52b788' }}>
                <PawPrint size={30} />
              </div>
              <div className="paw-float paw-4" style={{ color: '#40916c' }}>
                <PawPrint size={22} />
              </div>
              <div className="paw-float paw-5" style={{ color: '#95d5b2' }}>
                <PawPrint size={18} />
              </div>

              <div className="dog-svg-container">
                <AnimatedDog />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ═══ ABOUT / WELCOME SECTION ═══ */}
      <section className="about-section" id="about" aria-label="About PetPulse">
        <div className="container">
          <div className="about-header">
            <span className="section-tag">Our Story</span>
            <h2 className="about-title">
              Sri Lanka's Most Trusted<br />
              <span className="italic">Pet Wellness Destination</span>
            </h2>
            <p className="about-description">
              Founded with a vision to revolutionize veterinary care in Sri Lanka, PetPulse blends
              advanced medical science with genuine love for animals. Every tail wag, every purr,
              every chirp — they all matter deeply to us.
            </p>
          </div>

          {/* Animated stats strip */}
          <div className="stats-strip">
            {statsData.map(({ target, label, suffix }) => (
              <div key={label} className="stats-strip-item">
                <StatCounter target={target} label={label} suffix={suffix} />
                <span className="stats-strip-label">{label}</span>
              </div>
            ))}
          </div>

          {/* Doctor cards */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="section-tag">Meet Our Experts</span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 3vw, 40px)',
              color: 'var(--text-primary)',
              marginTop: '12px',
              marginBottom: '8px',
            }}>
              The Healers Behind the Smiles
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Board-certified professionals who put your pet first, always.
            </p>
          </div>

          <div className="doctors-grid">
            {doctors.map((doc) => (
              <div className="doctor-card" key={doc.name}>
                <div className="doctor-avatar">
                  <div className="doctor-avatar-placeholder">
                    {doc.emoji}
                  </div>
                </div>
                <div>
                  <div className="doctor-title">{doc.title}</div>
                  <div className="doctor-name">{doc.name}</div>
                </div>
                <p className="doctor-specialty">{doc.specialty}</p>
                <div className="doctor-tags">
                  {doc.tags.map((tag) => (
                    <span className="doctor-tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="doctor-experience">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green-sage)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {doc.experience}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {doc.degree}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES SECTION ═══ */}
      <section className="services-section" id="services" aria-label="Our services">
        <div className="container">
          <div className="services-header">
            <span className="section-tag">What We Offer</span>
            <h2 className="services-title">
              Care Tailored for<br />
              <span className="services-title-highlight">
                Every Kind of Pet
              </span>
            </h2>
            <p className="services-subtitle">
              From routine wellness visits to complex procedures, we have the expertise
              and facilities to care for every species with precision and love.
            </p>
          </div>

          {/* Pet category cards */}
          <div className="pet-categories">
            {petCategories.map(({ icon, label, count, color, glow, gradient }) => (
              <Link
                to="/services"
                className="pet-card"
                key={label}
                style={{
                  '--pet-color': color,
                  '--pet-glow': glow,
                  '--pet-gradient': gradient,
                }}
                id={`pet-card-${label.toLowerCase()}`}
              >
                <span className="pet-icon">{icon}</span>
                <div className="pet-label">{label}</div>
                <div className="pet-count">{count}</div>
              </Link>
            ))}
          </div>

          {/* Feature banners */}
          <div className="feature-banners">
            <div className="feature-banner feature-banner-1">
              <span className="feature-banner-emoji">🐶</span>
              <span className="feature-banner-tag">New Arrival</span>
              <h3 className="feature-banner-title">New Puppy?<br />We've Got You Covered</h3>
              <p className="feature-banner-text">
                From first vaccines to early nutrition guidance — our New Puppy Program
                gives your little furball the best possible start in life.
              </p>
              <Link to="/services" className="feature-banner-btn" id="new-puppy-btn">
                Get Started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="feature-banner feature-banner-2">
              <span className="feature-banner-emoji">🐱</span>
              <span className="feature-banner-tag">Special Care</span>
              <h3 className="feature-banner-title">Senior Pet<br />Wellness Program</h3>
              <p className="feature-banner-text">
                Our senior care specialists create personalised health plans to keep your
                older companions comfortable, active, and full of joy.
              </p>
              <Link to="/services" className="feature-banner-btn" id="senior-pet-btn">
                Learn More
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
