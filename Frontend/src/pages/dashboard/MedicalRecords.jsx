const records = [
  {
    id: 1, pet: 'Max', species: '🐕', date: 'May 10, 2026',
    type: 'Diagnosis', condition: 'Otitis Externa (Ear Infection)',
    vet: 'Dr. Rohan Silva', notes: 'Right ear canal inflamed. Prescribed Otomax ear drops, twice daily for 7 days.',
    prescription: 'Otomax Ear Drops 7.5g',
    severity: 'mild',
  },
  {
    id: 2, pet: 'Luna', species: '🐈', date: 'Apr 28, 2026',
    type: 'Surgery Follow-up', condition: 'Post-Spay Recovery',
    vet: 'Dr. Amara Perera', notes: 'Wound healing perfectly. Stitches removed. Full recovery confirmed.',
    prescription: 'None',
    severity: 'none',
  },
  {
    id: 3, pet: 'Max', species: '🐕', date: 'Mar 15, 2026',
    type: 'Vaccination', condition: 'Annual DHPP + Rabies',
    vet: 'Dr. Amara Perera', notes: 'Annual vaccinations administered. Next due in 12 months.',
    prescription: 'None',
    severity: 'none',
  },
  {
    id: 4, pet: 'Luna', species: '🐈', date: 'Feb 08, 2026',
    type: 'Checkup', condition: 'Routine Health Examination',
    vet: 'Dr. Amara Perera', notes: 'General health good. Weight 4.2kg. Slight tartar build-up — dental cleaning recommended.',
    prescription: 'Dental chews recommended',
    severity: 'minor',
  },
  {
    id: 5, pet: 'Max', species: '🐕', date: 'Jan 20, 2026',
    type: 'Treatment', condition: 'Flea & Tick Prevention',
    vet: 'Dr. Rohan Silva', notes: 'Bravecto administered. Next treatment due in 3 months.',
    prescription: 'Bravecto 1000mg',
    severity: 'none',
  },
];

const severityStyle = {
  none:   { color: '#40916c', bg: 'rgba(64,145,108,0.1)',  label: 'All Clear'  },
  mild:   { color: '#e9a84c', bg: 'rgba(233,168,76,0.12)', label: 'Mild'       },
  minor:  { color: '#e9a84c', bg: 'rgba(233,168,76,0.12)', label: 'Minor'      },
  moderate:{ color: '#d4704a', bg: 'rgba(212,112,74,0.12)', label: 'Moderate'  },
  severe: { color: '#c0392b', bg: 'rgba(192,57,43,0.12)',   label: 'Severe'    },
};

const typeColor = {
  'Vaccination':    '#2d7a4f',
  'Diagnosis':      '#e9a84c',
  'Treatment':      '#40916c',
  'Surgery Follow-up': '#52b788',
  'Checkup':        '#95d5b2',
};

export default function MedicalRecords() {
  return (
    <div className="dash-page" id="medical-records-page">
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">Medical Records</h1>
          <p className="dash-page-subtitle">Complete health history for all your pets</p>
        </div>
        <button
          className="btn-primary"
          style={{ borderRadius: '12px', padding: '12px 24px', fontSize: '14px' }}
          id="export-records-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export Records
        </button>
      </div>

      {/* Pet tabs filter */}
      <div className="appt-filters" style={{ marginBottom: 28 }}>
        {['All Pets', '🐕 Max', '🐈 Luna'].map((f) => (
          <button key={f} className={`appt-filter-btn ${f === 'All Pets' ? 'active' : ''}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Records */}
      <div className="records-list">
        {records.map((rec) => {
          const sv = severityStyle[rec.severity] || severityStyle.none;
          const tc = typeColor[rec.type] || '#52b788';
          return (
            <div className="record-card" key={rec.id} id={`record-${rec.id}`}>
              {/* Left accent */}
              <div className="record-card-accent" style={{ background: tc }} />

              <div className="record-card-body">
                <div className="record-card-top">
                  <div className="record-card-left">
                    <div className="record-type-badge" style={{ background: `${tc}18`, color: tc }}>
                      {rec.type}
                    </div>
                    <h3 className="record-condition">{rec.condition}</h3>
                  </div>
                  <div className="record-card-right">
                    <span className="appt-status-badge" style={{ background: sv.bg, color: sv.color }}>
                      {sv.label}
                    </span>
                    <div className="record-date">{rec.date}</div>
                  </div>
                </div>

                <div className="record-meta-row">
                  <span className="appt-card-meta-chip">
                    {rec.species} {rec.pet}
                  </span>
                  <span className="appt-card-meta-chip">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {rec.vet}
                  </span>
                </div>

                <p className="record-notes">{rec.notes}</p>

                {rec.prescription !== 'None' && (
                  <div className="record-prescription">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d7a4f" strokeWidth="2" strokeLinecap="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
                    <span>Prescribed: <strong>{rec.prescription}</strong></span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
