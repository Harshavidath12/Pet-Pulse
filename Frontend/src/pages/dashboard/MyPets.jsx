import { useState, useEffect } from 'react';
import api from '../../api';

const petConfig = {
  Dog:    { bg: 'linear-gradient(135deg,#d4f1de,#a8ddb5)', emoji: '🐕', accent: '#2d7a4f' },
  Cat:    { bg: 'linear-gradient(135deg,#fde8d4,#f4b88c)', emoji: '🐈', accent: '#c97b3a' },
  Bird:   { bg: 'linear-gradient(135deg,#d4eaf9,#90c8f0)', emoji: '🐦', accent: '#2980b9' },
  Rabbit: { bg: 'linear-gradient(135deg,#ead4f4,#cc9ef0)', emoji: '🐇', accent: '#8e44ad' },
  Exotic: { bg: 'linear-gradient(135deg,#fdf0d4,#f4d078)', emoji: '🦎', accent: '#d4a010' },
  Other:  { bg: 'linear-gradient(135deg,#e8e8e8,#cccccc)', emoji: '🐾', accent: '#555555' },
};

const EMPTY_FORM = {
  name: '', species: 'Dog', breed: '', age: '', weight: '',
  gender: 'Male', color: '', notes: '',
  isVaccinated: false, isMicrochipped: false, isSpayedNeutered: false, isIndoor: false,
};

/* ── Add/Edit Pet Modal ── */
function AddPetModal({ onClose, onSaved, editPet }) {
  const [form, setForm] = useState(editPet || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggle = (key) => setForm(f => ({ ...f, [key]: !f[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editPet) {
        const { data } = await api.put(`/api/pets/${editPet._id}`, form);
        onSaved(data, 'edit');
      } else {
        const { data } = await api.post('/api/pets', form);
        onSaved(data, 'add');
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const cfg = petConfig[form.species] || petConfig.Dog;

  return (
    <div className="auth-overlay" onClick={onClose} role="dialog" aria-modal="true" style={{ alignItems: 'flex-start', paddingTop: '80px' }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 24, width: '100%', maxWidth: 560,
          maxHeight: '90vh', overflowY: 'auto', position: 'relative',
          boxShadow: '0 32px 80px rgba(30,86,49,0.2)', animation: 'cardIn 0.3s ease',
        }}
      >
        {/* Header banner */}
        <div style={{ background: cfg.bg, padding: '32px 32px 24px', borderRadius: '24px 24px 0 0', textAlign: 'center' }}>
          <div style={{ fontSize: 60, marginBottom: 8 }}>{cfg.emoji}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: 0, color: '#1a1a1a' }}>
            {editPet ? 'Edit Pet Profile' : 'Register a New Pet'}
          </h2>
          <p style={{ color: '#555', margin: '6px 0 0', fontSize: 14 }}>Fill in your pet's details below</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '28px 32px 32px' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14 }}>
              {error}
            </div>
          )}

          {/* Row 1: Name + Species */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Pet Name *</label>
              <input style={inputStyle} placeholder="e.g. Max" value={form.name}
                onChange={e => set('name', e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Species *</label>
              <select style={inputStyle} value={form.species} onChange={e => set('species', e.target.value)} required>
                {['Dog','Cat','Bird','Rabbit','Exotic','Other'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2: Breed + Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Breed</label>
              <input style={inputStyle} placeholder="e.g. Golden Retriever" value={form.breed}
                onChange={e => set('breed', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select style={inputStyle} value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
          </div>

          {/* Row 3: Age + Weight + Color */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Age (years)</label>
              <input style={inputStyle} type="number" min="0" step="0.5" placeholder="e.g. 2"
                value={form.age} onChange={e => set('age', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Weight (kg)</label>
              <input style={inputStyle} type="number" min="0" step="0.1" placeholder="e.g. 28"
                value={form.weight} onChange={e => set('weight', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Color</label>
              <input style={inputStyle} placeholder="e.g. Golden" value={form.color}
                onChange={e => set('color', e.target.value)} />
            </div>
          </div>

          {/* Checkboxes */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...labelStyle, marginBottom: 12 }}>Health & Lifestyle</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { key: 'isVaccinated',     label: '💉 Vaccinated' },
                { key: 'isMicrochipped',   label: '🔬 Microchipped' },
                { key: 'isSpayedNeutered', label: '✂️ Spayed / Neutered' },
                { key: 'isIndoor',         label: '🏠 Indoor Pet' },
              ].map(({ key, label }) => (
                <label key={key} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                  borderRadius: 10, border: `2px solid ${form[key] ? cfg.accent : '#e2e8f0'}`,
                  background: form[key] ? cfg.bg : '#f8fafc', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, color: form[key] ? cfg.accent : '#64748b',
                  transition: 'all 0.2s',
                }}>
                  <input type="checkbox" checked={form[key]} onChange={() => toggle(key)}
                    style={{ accentColor: cfg.accent, width: 16, height: 16 }} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
              placeholder="Any additional notes about your pet..."
              value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '14px', borderRadius: 12, border: '2px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ flex: 2, padding: '14px', borderRadius: 12, border: 'none', background: 'var(--gradient-green)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: 14, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving...' : editPet ? '✓ Save Changes' : '+ Add Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 10,
  border: '1.5px solid #e2e8f0', background: '#f8fafc',
  fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box',
  outline: 'none', transition: 'border-color 0.2s',
};

/* ── Pet Card ── */
function PetCard({ pet, onView, onEdit }) {
  const cfg = petConfig[pet.species] || petConfig.Other;
  const tags = [
    pet.isVaccinated     && 'Vaccinated',
    pet.isMicrochipped   && 'Microchipped',
    pet.isSpayedNeutered && 'Spayed/Neutered',
    pet.isIndoor         && 'Indoor',
  ].filter(Boolean);

  return (
    <div className="pet-profile-card" id={`pet-card-${pet._id}`}>
      <div className="pet-card-banner" style={{ background: cfg.bg }}>
        <span className="pet-card-avatar">{cfg.emoji}</span>
        {pet.gender && (
          <div className="pet-card-gender-badge">{pet.gender === 'Male' ? '♂' : '♀'}</div>
        )}
      </div>
      <div className="pet-card-body">
        <h3 className="pet-card-name">{pet.name}</h3>
        <p className="pet-card-breed">{pet.breed || pet.species}</p>
        <div className="pet-card-meta-row">
          {pet.age && (
            <span className="pet-card-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              {pet.age} yr{pet.age !== 1 ? 's' : ''}
            </span>
          )}
          {pet.weight && (
            <span className="pet-card-meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              {pet.weight} kg
            </span>
          )}
        </div>
        {tags.length > 0 && (
          <div className="pet-card-tags">
            {tags.map(t => (
              <span key={t} className="pet-card-tag" style={{ borderColor: cfg.accent, color: cfg.accent }}>{t}</span>
            ))}
          </div>
        )}
        <div className="pet-card-actions">
          <button className="pet-card-btn-primary" onClick={() => onView(pet)} id={`view-pet-${pet._id}`}>
            View Profile
          </button>
          <button className="pet-card-btn-secondary" onClick={() => onEdit(pet)} id={`edit-pet-${pet._id}`}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Pet Detail Modal ── */
function PetDetailModal({ pet, onClose }) {
  if (!pet) return null;
  const cfg = petConfig[pet.species] || petConfig.Other;
  const tags = [
    pet.isVaccinated     && '💉 Vaccinated',
    pet.isMicrochipped   && '🔬 Microchipped',
    pet.isSpayedNeutered && '✂️ Spayed/Neutered',
    pet.isIndoor         && '🏠 Indoor',
  ].filter(Boolean);

  return (
    <div className="auth-overlay" onClick={onClose} role="dialog" aria-modal="true" style={{ alignItems: 'flex-start', paddingTop: '80px' }}>
      <div className="pet-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div className="pet-detail-banner" style={{ background: cfg.bg }}>
          <span style={{ fontSize: 64 }}>{cfg.emoji}</span>
        </div>
        <div className="pet-detail-body">
          <h2 className="pet-detail-name">{pet.name}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            {pet.breed || pet.species} {pet.gender ? `· ${pet.gender}` : ''}
          </p>
          <div className="pet-detail-grid">
            {[
              { label: 'Age',     value: pet.age     ? `${pet.age} year${pet.age !== 1 ? 's' : ''}` : '—' },
              { label: 'Weight',  value: pet.weight  ? `${pet.weight} kg` : '—' },
              { label: 'Species', value: pet.species || '—' },
              { label: 'Color',   value: pet.color   || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="pet-detail-stat">
                <span className="pet-detail-stat-label">{label}</span>
                <span className="pet-detail-stat-value">{value}</span>
              </div>
            ))}
          </div>
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {tags.map(t => (
                <span key={t} style={{ padding: '6px 14px', borderRadius: 100, background: cfg.bg, color: cfg.accent, fontWeight: 700, fontSize: 13, border: `1px solid ${cfg.accent}` }}>
                  {t}
                </span>
              ))}
            </div>
          )}
          {pet.notes && (
            <div style={{ padding: '14px 16px', background: 'var(--bg-primary)', borderRadius: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
              <strong>Notes:</strong> {pet.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function MyPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [editPet, setEditPet] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchPets = async () => {
    try {
      const { data } = await api.get('/api/pets');
      setPets(data);
    } catch (err) {
      setError('Failed to load pets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPets(); }, []);

  const handleSaved = (pet, action) => {
    if (action === 'add') {
      setPets(prev => [pet, ...prev]);
    } else {
      setPets(prev => prev.map(p => p._id === pet._id ? pet : p));
    }
    setEditPet(null);
    setShowAddForm(false);
  };

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

      {loading && <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading your pets…</div>}
      {error && <div style={{ textAlign: 'center', padding: 40, color: '#b91c1c' }}>{error}</div>}

      {!loading && !error && (
        <div className="pets-grid">
          {pets.map(pet => (
            <PetCard
              key={pet._id}
              pet={pet}
              onView={setSelectedPet}
              onEdit={p => { setEditPet(p); setShowAddForm(true); }}
            />
          ))}

          {/* Add placeholder card */}
          <div className="pet-add-card" onClick={() => { setEditPet(null); setShowAddForm(true); }} id="add-pet-card">
            <div className="pet-add-card-inner">
              <div className="pet-add-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <p className="pet-add-label">Add New Pet</p>
              <p className="pet-add-sub">Register another furry companion</p>
            </div>
          </div>
        </div>
      )}

      {/* Pet detail modal */}
      {selectedPet && <PetDetailModal pet={selectedPet} onClose={() => setSelectedPet(null)} />}

      {/* Add / Edit modal */}
      {showAddForm && (
        <AddPetModal
          editPet={editPet}
          onClose={() => { setShowAddForm(false); setEditPet(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
