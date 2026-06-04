import { useState, useEffect, useRef } from 'react';
import api from '../api';

export default function BookingModal({ isOpen, onClose, defaultServiceType }) {
  const [pets, setPets] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({ pet: '', doctor: '', date: '', time: '', reason: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [conflictWarning, setConflictWarning] = useState(null); // { message, nextAvailableTime }
  const [checkingConflict, setCheckingConflict] = useState(false);
  const conflictTimerRef = useRef(null);

  // Fetch pets
  const fetchPets = async () => {
    try {
      const res = await api.get('/api/appointments/pets');
      setPets(res.data);
      if (res.data.length > 0) setFormData(prev => ({ ...prev, pet: res.data[0]._id }));
    } catch (err) { console.error('Failed to fetch pets:', err); }
  };

  // Fetch doctors filtered by specialty
  const fetchDoctors = async () => {
    try {
      const res = await api.get(`/api/doctors?specialty=${encodeURIComponent(defaultServiceType || '')}`);
      setDoctors(res.data);
      if (res.data.length > 0) setFormData(prev => ({ ...prev, doctor: res.data[0]._id }));
    } catch (err) { console.error('Failed to fetch doctors:', err); }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPets();
      fetchDoctors();
      setSuccess(false);
      setError('');
      setConflictWarning(null);
      setFormData({ pet: '', doctor: '', date: '', time: '', reason: '', notes: '' });
    }
  }, [isOpen, defaultServiceType]);

  // Check conflict whenever doctor, date, or time changes
  useEffect(() => {
    if (!formData.doctor || !formData.date || !formData.time) {
      setConflictWarning(null);
      return;
    }
    // Debounce: wait 400ms after user stops typing
    clearTimeout(conflictTimerRef.current);
    conflictTimerRef.current = setTimeout(async () => {
      setCheckingConflict(true);
      try {
        const { data } = await api.get(
          `/api/appointments/check-conflict?doctorId=${formData.doctor}&date=${formData.date}&time=${formData.time}`
        );
        setConflictWarning(data.conflict ? data : null);
      } catch (err) {
        console.error('Conflict check failed:', err);
      } finally {
        setCheckingConflict(false);
      }
    }, 400);
    return () => clearTimeout(conflictTimerRef.current);
  }, [formData.doctor, formData.date, formData.time]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (conflictWarning) return; // block if conflict
    setLoading(true);
    setError('');
    try {
      await api.post('/api/appointments', {
        ...formData,
        vet: formData.doctor,
        serviceType: defaultServiceType,
      });
      setSuccess(true);
      setTimeout(() => { onClose(); }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 520, width: '100%', padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #1e5631, #2d7a4f)', padding: '28px 32px 22px', color: 'white' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
          <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking for</div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 22 }}>📅 {defaultServiceType}</h2>
        </div>

        <div style={{ padding: '24px 32px 28px' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
              <h3 style={{ color: '#1e5631', marginBottom: 8 }}>Appointment Booked!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>We'll see you soon. Check your dashboard for details.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              {/* Select Pet */}
              <div style={groupStyle}>
                <label style={labelStyle}>🐾 Select Your Pet</label>
                <select style={inputStyle} value={formData.pet} onChange={e => set('pet', e.target.value)} required>
                  {pets.length === 0
                    ? <option value="">No pets found — add one in My Pets first</option>
                    : pets.map(p => <option key={p._id} value={p._id}>{p.name} ({p.species})</option>)
                  }
                </select>
              </div>

              {/* Select Doctor */}
              <div style={groupStyle}>
                <label style={labelStyle}>👨‍⚕️ Select Doctor</label>
                <select style={inputStyle} value={formData.doctor} onChange={e => set('doctor', e.target.value)} required>
                  {doctors.length === 0
                    ? <option value="">No doctors available for this service</option>
                    : doctors.map(d => (
                        <option key={d._id} value={d._id}>
                          {d.name} — {d.specialties?.join(', ')}
                        </option>
                      ))
                  }
                </select>
                {doctors.length > 0 && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>
                    Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} specialized in {defaultServiceType}
                  </div>
                )}
              </div>

              {/* Date & Time in a row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>📅 Preferred Date</label>
                  <input style={inputStyle} type="date" min={todayStr} value={formData.date}
                    onChange={e => set('date', e.target.value)} required />
                </div>
                <div>
                  <label style={labelStyle}>🕐 Time Slot</label>
                  <input style={inputStyle} type="time" value={formData.time}
                    onChange={e => set('time', e.target.value)} required />
                </div>
              </div>

              {/* Conflict Warning */}
              {checkingConflict && (
                <div style={{ ...warningStyle, background: '#f0f9ff', borderColor: '#bae6fd', color: '#0369a1' }}>
                  ⏳ Checking availability...
                </div>
              )}
              {!checkingConflict && conflictWarning && (
                <div style={warningStyle}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>⚠️ Doctor Already Booked</div>
                  <div style={{ fontSize: 13 }}>{conflictWarning.message}</div>
                  <button
                    type="button"
                    onClick={() => set('time', conflictWarning.nextAvailableTime)}
                    style={{ marginTop: 10, padding: '6px 16px', borderRadius: 8, border: 'none', background: '#b45309', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    Use {conflictWarning.nextAvailableTime} instead →
                  </button>
                </div>
              )}
              {!checkingConflict && !conflictWarning && formData.doctor && formData.date && formData.time && (
                <div style={{ ...warningStyle, background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534', marginBottom: 16 }}>
                  ✅ Time slot is available!
                </div>
              )}

              {/* Reason */}
              <div style={groupStyle}>
                <label style={labelStyle}>Reason for Visit</label>
                <input style={inputStyle} type="text" placeholder="E.g., Routine checkup, limping, vaccinations"
                  value={formData.reason} onChange={e => set('reason', e.target.value)} required />
              </div>

              {/* Notes */}
              <div style={groupStyle}>
                <label style={labelStyle}>Notes for the Vet</label>
                <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
                  placeholder="Any special instructions or symptoms..."
                  value={formData.notes} onChange={e => set('notes', e.target.value)} />
              </div>

              {/* Error */}
              {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: 14 }}>{error}</div>}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || pets.length === 0 || !!conflictWarning || checkingConflict}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                  background: conflictWarning ? '#94a3b8' : 'linear-gradient(135deg, #1e5631, #2d7a4f)',
                  color: 'white', fontWeight: 700, fontSize: 15, cursor: conflictWarning ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1, transition: 'all 0.2s',
                }}
              >
                {loading ? 'Booking...' : conflictWarning ? '⚠️ Resolve Conflict to Book' : '✓ Confirm Appointment'}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const groupStyle = { marginBottom: 16 };
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 10,
  border: '1.5px solid #e2e8f0', background: '#f8fafc',
  fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box',
};
const warningStyle = {
  background: '#fffbeb', border: '1.5px solid #fcd34d', color: '#92400e',
  borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14,
};
