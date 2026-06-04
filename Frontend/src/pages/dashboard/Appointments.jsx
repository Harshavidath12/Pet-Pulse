import { useState, useEffect } from 'react';
import api from '../../api';

const statusStyle = {
  pending:   { bg: 'rgba(233,168,76,0.12)',  color: '#c17a10',  label: 'Pending Approval' },
  confirmed: { bg: 'rgba(45,122,79,0.1)',    color: '#2d7a4f',  label: 'Confirmed' },
  completed: { bg: 'rgba(82,183,136,0.12)',  color: '#40916c',  label: 'Completed' },
  declined:  { bg: 'rgba(212,112,74,0.12)',  color: '#d4704a',  label: 'Declined' },
};

const speciesEmoji = { Dog: '🐕', Cat: '🐈', Bird: '🐦', Rabbit: '🐇', Exotic: '🦎', Other: '🐾' };

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function AppointmentCard({ appt, onSelect, isSelected }) {
  const st = statusStyle[appt.status] || statusStyle.pending;
  const d = new Date(appt.date);
  const day   = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const petEmoji = speciesEmoji[appt.pet?.species] || '🐾';

  return (
    <div
      className={`appt-card ${isSelected ? 'appt-card--selected' : ''}`}
      onClick={() => onSelect(appt)}
      id={`appt-card-${appt._id}`}
    >
      <div className="appt-card-left">
        <div className="appt-card-date-box">
          <span className="appt-card-day">{day}</span>
          <span className="appt-card-month">{month}</span>
        </div>
      </div>

      <div className="appt-card-body">
        <div className="appt-card-top">
          <h3 className="appt-card-service">{appt.serviceType || appt.reason || 'Appointment'}</h3>
          <span className="appt-status-badge" style={{ background: st.bg, color: st.color }}>
            {st.label}
          </span>
        </div>
        <p className="appt-card-vet">{appt.vet?.name || 'Doctor not assigned yet'}</p>
        <div className="appt-card-meta">
          <span className="appt-card-meta-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {appt.time}
          </span>
          {appt.pet && (
            <span className="appt-card-meta-chip">
              {petEmoji} {appt.pet.name}
            </span>
          )}
        </div>
      </div>

      <svg className="appt-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  );
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/api/appointments/my');
      setAppointments(data);
    } catch (err) {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const filters = ['all', 'pending', 'confirmed', 'completed', 'declined'];

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter);

  return (
    <div className="dash-page" id="appointments-page">
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Appointments</h1>
          <p className="dash-page-subtitle">Track all your scheduled and past veterinary visits</p>
        </div>
        <button
          className="btn-primary"
          style={{ borderRadius: '12px', padding: '12px 24px', fontSize: '14px' }}
          id="book-appointment-dash-btn"
          onClick={() => window.location.href = '/services'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Book Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="appt-filters">
        {filters.map(f => (
          <button
            key={f}
            className={`appt-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            id={`appt-filter-${f}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading appointments…</div>}
      {error   && <div style={{ textAlign: 'center', padding: 40, color: '#b91c1c' }}>{error}</div>}

      {!loading && !error && (
        <div className="appt-layout">
          {/* List */}
          <div className="appt-list">
            {filtered.length === 0 ? (
              <div className="dash-empty-state">
                <span style={{ fontSize: 48 }}>📭</span>
                <p>No {filter === 'all' ? '' : filter} appointments yet.</p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                  Book one from the <a href="/services" style={{ color: 'var(--green-forest)' }}>Services</a> page.
                </p>
              </div>
            ) : (
              filtered.map(a => (
                <AppointmentCard
                  key={a._id}
                  appt={a}
                  onSelect={setSelected}
                  isSelected={selected?._id === a._id}
                />
              ))
            )}
          </div>

          {/* Detail panel */}
          <div className={`appt-detail-panel ${selected ? 'appt-detail-panel--visible' : ''}`}>
            {selected ? (
              <>
                <div className="appt-detail-header">
                  <h2 className="appt-detail-service">{selected.serviceType || selected.reason}</h2>
                  <span className="appt-status-badge" style={{ background: statusStyle[selected.status]?.bg, color: statusStyle[selected.status]?.color }}>
                    {statusStyle[selected.status]?.label}
                  </span>
                </div>

                <div className="appt-detail-grid">
                  {[
                    { icon: '📅', label: 'Date',         value: formatDate(selected.date) },
                    { icon: '🕐', label: 'Time',         value: selected.time },
                    { icon: '👩‍⚕️', label: 'Veterinarian', value: selected.vet?.name || 'TBD' },
                    { icon: '🐾', label: 'Pet',          value: `${speciesEmoji[selected.pet?.species] || '🐾'} ${selected.pet?.name || '—'}` },
                    { icon: '💊', label: 'Service',      value: selected.serviceType || '—' },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="appt-detail-item">
                      <span className="appt-detail-icon">{icon}</span>
                      <div>
                        <div className="appt-detail-label">{label}</div>
                        <div className="appt-detail-value">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {selected.notes && (
                  <div className="appt-detail-notes">
                    <h4 className="appt-detail-notes-title">Notes</h4>
                    <p>{selected.notes}</p>
                  </div>
                )}

                {selected.status === 'pending' && (
                  <div style={{ marginTop: 16, padding: '12px 16px', background: '#fffbeb', borderRadius: 10, border: '1px solid #fcd34d', fontSize: 13, color: '#92400e' }}>
                    ⏳ Your appointment is awaiting admin approval.
                  </div>
                )}
              </>
            ) : (
              <div className="dash-empty-state" style={{ height: '100%' }}>
                <span style={{ fontSize: 48 }}>📋</span>
                <p>Select an appointment to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
