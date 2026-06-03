import { useState } from 'react';

/* Pet avatar with species-based gradient */
const petConfig = {
  dog:    { bg: 'linear-gradient(135deg,#d4f1de,#a8ddb5)', emoji: '🐕', accent: '#2d7a4f' },
  cat:    { bg: 'linear-gradient(135deg,#fde8d4,#f4b88c)', emoji: '🐈', accent: '#c97b3a' },
  bird:   { bg: 'linear-gradient(135deg,#d4eaf9,#90c8f0)', emoji: '🐦', accent: '#2980b9' },
  rabbit: { bg: 'linear-gradient(135deg,#ead4f4,#cc9ef0)', emoji: '🐇', accent: '#8e44ad' },
  exotic: { bg: 'linear-gradient(135deg,#fdf0d4,#f4d078)', emoji: '🦎', accent: '#d4a010' },
};

const pets = [
  {
    id: 1,
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    age: '2 years',
    weight: '28 kg',
    gender: 'Male',
    nextAppt: { date: 'Jun 15', service: 'Annual Checkup' },
    vaccinations: 'Up to date',
    lastVisit: '3 months ago',
    tags: ['Vaccinated', 'Microchipped'],
  },
  {
    id: 2,
    name: 'Luna',
    species: 'cat',
    breed: 'Siamese',
    age: '1 year',
    weight: '4.2 kg',
    gender: 'Female',
    nextAppt: { date: 'Jun 22', service: 'Dental Cleaning' },
    vaccinations: '1 due soon',
    lastVisit: '1 month ago',
    tags: ['Spayed', 'Indoor'],
  },
];

function PetCard({ pet, onView }) {
  const cfg = petConfig[pet.species] || petConfig.dog;
  return (
    <div className="pet-profile-card" id={`pet-card-${pet.id}`}>
      {/* Banner */}
      <div className="pet-card-banner" style={{ background: cfg.bg }}>
        <span className="pet-card-avatar">{cfg.emoji}</span>
        <div className="pet-card-gender-badge">
          {pet.gender === 'Male' ? '♂' : '♀'}
        </div>
      </div>

      {/* Body */}
      <div className="pet-card-body">
        <h3 className="pet-card-name">{pet.name}</h3>
        <p className="pet-card-breed">{pet.breed}</p>

        <div className="pet-card-meta-row">
          <span className="pet-card-meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {pet.age}
          </span>
          <span className="pet-card-meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            {pet.weight}
          </span>
        </div>

        {/* Tags */}
        <div className="pet-card-tags">
          {pet.tags.map((t) => (
            <span key={t} className="pet-card-tag" style={{ borderColor: cfg.accent, color: cfg.accent }}>
              {t}
            </span>
          ))}
        </div>

        {/* Next appointment */}
        {pet.nextAppt && (
          <div className="pet-card-appt">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d7a4f" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Next: <strong>{pet.nextAppt.date}</strong> — {pet.nextAppt.service}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pet-card-actions">
          <button className="pet-card-btn-primary" onClick={() => onView(pet)} id={`view-pet-${pet.id}`}>
            View Profile
          </button>
          <button className="pet-card-btn-secondary" id={`edit-pet-${pet.id}`}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

/* Pet detail modal */
function PetDetailModal({ pet, onClose }) {
  if (!pet) return null;
  const cfg = petConfig[pet.species] || petConfig.dog;

  return (
    <div className="auth-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pet-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="pet-detail-banner" style={{ background: cfg.bg }}>
          <span style={{ fontSize: 64 }}>{cfg.emoji}</span>
        </div>

        <div className="pet-detail-body">
          <h2 className="pet-detail-name">{pet.name}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{pet.breed} · {pet.gender}</p>

          <div className="pet-detail-grid">
            {[
              { label: 'Age', value: pet.age },
              { label: 'Weight', value: pet.weight },
              { label: 'Last Visit', value: pet.lastVisit },
              { label: 'Vaccinations', value: pet.vaccinations },
            ].map(({ label, value }) => (
              <div key={label} className="pet-detail-stat">
                <span className="pet-detail-stat-label">{label}</span>
                <span className="pet-detail-stat-value">{value}</span>
              </div>
            ))}
          </div>

          {pet.nextAppt && (
            <div className="pet-detail-appt">
              <span style={{ fontSize: 18 }}>📅</span>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Next Appointment</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{pet.nextAppt.date} — {pet.nextAppt.service}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyPets() {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="dash-page" id="my-pets-page">
      {/* Header */}
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">My Pets</h1>
          <p className="dash-page-subtitle">Manage all your registered pets in one place</p>
        </div>
        <button
          className="btn-primary"
          style={{ borderRadius: '12px', padding: '12px 24px', fontSize: '14px' }}
          onClick={() => setShowAddForm(true)}
          id="add-new-pet-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add New Pet
        </button>
      </div>

      {/* Pet cards grid */}
      <div className="pets-grid">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} onView={setSelectedPet} />
        ))}

        {/* Add pet placeholder card */}
        <div className="pet-add-card" onClick={() => setShowAddForm(true)} id="add-pet-card">
          <div className="pet-add-card-inner">
            <div className="pet-add-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <p className="pet-add-label">Add New Pet</p>
            <p className="pet-add-sub">Register another furry companion</p>
          </div>
        </div>
      </div>

      {/* Pet detail modal */}
      {selectedPet && (
        <PetDetailModal pet={selectedPet} onClose={() => setSelectedPet(null)} />
      )}

      {/* Add pet info note */}
      {showAddForm && (
        <div className="auth-overlay" onClick={() => setShowAddForm(false)} role="dialog">
          <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <button className="auth-close" onClick={() => setShowAddForm(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <div className="auth-header">
              <div className="auth-logo">🐾</div>
              <h2 className="auth-title">Add New Pet</h2>
              <p className="auth-subtitle">Full pet registration form coming soon in the next update!</p>
            </div>
            <div style={{ textAlign: 'center', fontSize: 64, margin: '20px 0' }}>🚀</div>
            <button className="auth-submit" onClick={() => setShowAddForm(false)}>Got it!</button>
          </div>
        </div>
      )}
    </div>
  );
}
