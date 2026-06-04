import { useState, useEffect } from 'react';
import api from '../../api';

const severityStyle = {
  none:     { color: '#40916c', bg: 'rgba(64,145,108,0.1)',  label: 'All Clear'  },
  mild:     { color: '#e9a84c', bg: 'rgba(233,168,76,0.12)', label: 'Mild'       },
  minor:    { color: '#e9a84c', bg: 'rgba(233,168,76,0.12)', label: 'Minor'      },
  moderate: { color: '#d4704a', bg: 'rgba(212,112,74,0.12)', label: 'Moderate'   },
  severe:   { color: '#c0392b', bg: 'rgba(192,57,43,0.12)',  label: 'Severe'     },
};

const typeColor = {
  'Vaccination':        '#2d7a4f',
  'Diagnosis':          '#e9a84c',
  'Treatment':          '#40916c',
  'Surgery Follow-up':  '#52b788',
  'Checkup':            '#95d5b2',
  'Appointment':        '#52b788',
};

const speciesEmoji = { Dog: '🐕', Cat: '🐈', Bird: '🐦', Rabbit: '🐇', Exotic: '🦎', Other: '🐾' };

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePet, setActivePet] = useState('all');

  // For now, medical records are derived from completed appointments
  const fetchData = async () => {
    try {
      const [apptRes, petRes] = await Promise.all([
        api.get('/api/appointments/my'),
        api.get('/api/pets'),
      ]);
      // Only show completed appointments as "records"
      setRecords(apptRes.data.filter(a => a.status === 'completed'));
      setPets(petRes.data);
    } catch (err) {
      setError('Failed to load medical records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = activePet === 'all'
    ? records
    : records.filter(r => r.pet?._id === activePet);

  return (
    <div className="dash-page" id="medical-records-page">
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Medical Records</h1>
          <p className="dash-page-subtitle">Complete health history for all your pets</p>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading records…</div>}
      {error   && <div style={{ textAlign: 'center', padding: 40, color: '#b91c1c' }}>{error}</div>}

      {!loading && !error && (
        <>
          {/* Pet filter tabs */}
          <div className="appt-filters" style={{ marginBottom: 28 }}>
            <button
              className={`appt-filter-btn ${activePet === 'all' ? 'active' : ''}`}
              onClick={() => setActivePet('all')}
            >
              All Pets
            </button>
            {pets.map(p => (
              <button
                key={p._id}
                className={`appt-filter-btn ${activePet === p._id ? 'active' : ''}`}
                onClick={() => setActivePet(p._id)}
              >
                {speciesEmoji[p.species] || '🐾'} {p.name}
              </button>
            ))}
          </div>

          {/* Records */}
          {filtered.length === 0 ? (
            <div className="dash-empty-state" style={{ padding: '80px 0' }}>
              <span style={{ fontSize: 56 }}>🗂️</span>
              <p style={{ marginTop: 12, fontWeight: 600 }}>No medical records yet</p>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 320, textAlign: 'center' }}>
                Completed appointments will appear here as medical records automatically.
              </p>
            </div>
          ) : (
            <div className="records-list">
              {filtered.map(rec => {
                const tc  = typeColor[rec.serviceType] || '#52b788';
                const sv  = severityStyle.none;
                const pet = rec.pet;
                return (
                  <div className="record-card" key={rec._id} id={`record-${rec._id}`}>
                    <div className="record-card-accent" style={{ background: tc }} />
                    <div className="record-card-body">
                      <div className="record-card-top">
                        <div className="record-card-left">
                          <div className="record-type-badge" style={{ background: `${tc}18`, color: tc }}>
                            {rec.serviceType || 'Appointment'}
                          </div>
                          <h3 className="record-condition">{rec.reason || rec.serviceType || 'Visit'}</h3>
                        </div>
                        <div className="record-card-right">
                          <span className="appt-status-badge" style={{ background: sv.bg, color: sv.color }}>
                            {sv.label}
                          </span>
                          <div className="record-date">{formatDate(rec.date)}</div>
                        </div>
                      </div>

                      <div className="record-meta-row">
                        {pet && (
                          <span className="appt-card-meta-chip">
                            {speciesEmoji[pet.species] || '🐾'} {pet.name}
                          </span>
                        )}
                        {rec.vet?.name && (
                          <span className="appt-card-meta-chip">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            {rec.vet.name}
                          </span>
                        )}
                        <span className="appt-card-meta-chip">🕐 {rec.time}</span>
                      </div>

                      {rec.notes && <p className="record-notes">{rec.notes}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
