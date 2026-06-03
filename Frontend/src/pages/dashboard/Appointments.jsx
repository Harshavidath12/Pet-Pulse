import { useState } from 'react';

const appointments = [
  {
    id: 1, date: 'Jun 15, 2026', time: '10:00 AM',
    vet: 'Dr. Amara Perera', service: 'Annual Checkup',
    pet: 'Max', species: '🐕', status: 'upcoming', duration: '30 min',
    notes: 'Routine annual wellness examination including weight, dental, eyes and ears check.',
  },
  {
    id: 2, date: 'Jun 22, 2026', time: '2:30 PM',
    vet: 'Dr. Rohan Silva', service: 'Dental Cleaning',
    pet: 'Luna', species: '🐈', status: 'upcoming', duration: '45 min',
    notes: 'Professional dental scaling and polishing under sedation.',
  },
  {
    id: 3, date: 'Jul 05, 2026', time: '11:00 AM',
    vet: 'Dr. Amara Perera', service: 'Vaccination Booster',
    pet: 'Max', species: '🐕', status: 'upcoming', duration: '15 min',
    notes: 'Annual booster vaccination — DHPP and Rabies.',
  },
  {
    id: 4, date: 'May 10, 2026', time: '9:00 AM',
    vet: 'Dr. Rohan Silva', service: 'Ear Infection Treatment',
    pet: 'Max', species: '🐕', status: 'completed', duration: '20 min',
    notes: 'Otitis externa treatment — ear drops prescribed for 7 days.',
  },
  {
    id: 5, date: 'Apr 28, 2026', time: '3:00 PM',
    vet: 'Dr. Amara Perera', service: 'Spay Surgery Follow-up',
    pet: 'Luna', species: '🐈', status: 'completed', duration: '20 min',
    notes: 'Post-operative check. Wound healing well. Stitches removed.',
  },
];

const statusStyle = {
  upcoming:  { bg: 'rgba(45,122,79,0.1)',   color: '#2d7a4f',  label: 'Upcoming'  },
  today:     { bg: 'rgba(233,168,76,0.12)',  color: '#c17a10',  label: 'Today'     },
  completed: { bg: 'rgba(82,183,136,0.12)',  color: '#40916c',  label: 'Completed' },
  cancelled: { bg: 'rgba(212,112,74,0.12)',  color: '#d4704a',  label: 'Cancelled' },
};

function AppointmentCard({ appt, onSelect, isSelected }) {
  const st = statusStyle[appt.status] || statusStyle.upcoming;
  return (
    <div
      className={`appt-card ${isSelected ? 'appt-card--selected' : ''}`}
      onClick={() => onSelect(appt)}
      id={`appt-card-${appt.id}`}
    >
      <div className="appt-card-left">
        <div className="appt-card-date-box">
          <span className="appt-card-day">{appt.date.split(' ')[1].replace(',', '')}</span>
          <span className="appt-card-month">{appt.date.split(' ')[0]}</span>
        </div>
      </div>

      <div className="appt-card-body">
        <div className="appt-card-top">
          <h3 className="appt-card-service">{appt.service}</h3>
          <span className="appt-status-badge" style={{ background: st.bg, color: st.color }}>
            {st.label}
          </span>
        </div>
        <p className="appt-card-vet">{appt.vet}</p>
        <div className="appt-card-meta">
          <span className="appt-card-meta-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {appt.time}
          </span>
          <span className="appt-card-meta-chip">
            {appt.species} {appt.pet}
          </span>
          <span className="appt-card-meta-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {appt.duration}
          </span>
        </div>
      </div>

      <svg className="appt-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </div>
  );
}

export default function Appointments() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filters = ['all', 'upcoming', 'completed'];
  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

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
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Book Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="appt-filters">
        {filters.map((f) => (
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

      {/* Two-column: list + detail */}
      <div className="appt-layout">
        {/* List */}
        <div className="appt-list">
          {filtered.map((a) => (
            <AppointmentCard
              key={a.id}
              appt={a}
              onSelect={setSelected}
              isSelected={selected?.id === a.id}
            />
          ))}
          {filtered.length === 0 && (
            <div className="dash-empty-state">
              <span style={{ fontSize: 48 }}>📭</span>
              <p>No {filter} appointments found.</p>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className={`appt-detail-panel ${selected ? 'appt-detail-panel--visible' : ''}`}>
          {selected ? (
            <>
              <div className="appt-detail-header">
                <h2 className="appt-detail-service">{selected.service}</h2>
                <span
                  className="appt-status-badge"
                  style={{
                    background: statusStyle[selected.status]?.bg,
                    color: statusStyle[selected.status]?.color,
                  }}
                >
                  {statusStyle[selected.status]?.label}
                </span>
              </div>

              <div className="appt-detail-grid">
                {[
                  { icon: '📅', label: 'Date', value: selected.date },
                  { icon: '🕐', label: 'Time', value: selected.time },
                  { icon: '👩‍⚕️', label: 'Veterinarian', value: selected.vet },
                  { icon: '⏱️', label: 'Duration', value: selected.duration },
                  { icon: '🐾', label: 'Pet', value: `${selected.species} ${selected.pet}` },
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

              <div className="appt-detail-notes">
                <h4 className="appt-detail-notes-title">Notes</h4>
                <p>{selected.notes}</p>
              </div>

              {selected.status === 'upcoming' && (
                <div className="appt-detail-actions">
                  <button className="btn-primary" style={{ borderRadius: '10px', padding: '10px 22px', fontSize: '14px' }}>
                    Reschedule
                  </button>
                  <button style={{
                    padding: '10px 22px', borderRadius: '10px', fontSize: '14px',
                    background: 'rgba(212,112,74,0.1)', color: '#d4704a',
                    border: '1px solid rgba(212,112,74,0.25)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600,
                  }}>
                    Cancel
                  </button>
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
    </div>
  );
}
