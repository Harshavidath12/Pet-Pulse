import { useState, useEffect } from 'react';
import api from '../api';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/api/admin/appointments');
      setAppointments(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { data } = await api.put(`/api/admin/appointments/${id}/status`, { status: newStatus });
      setAppointments(appointments.map(appt => appt._id === id ? { ...appt, status: data.status } : appt));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading appointments...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const otherAppointments = appointments.filter(a => a.status !== 'pending');

  const renderAppointmentCard = (appt, isPending) => (
    <div key={appt._id} style={{ 
      background: 'white', 
      borderRadius: '12px', 
      padding: '24px', 
      marginBottom: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: '1.5px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '4px', color: 'var(--text-primary)' }}>
            {appt.owner?.name} booking for {appt.pet?.name} ({appt.pet?.species})
          </h3>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>
            <strong>Requested Service:</strong> {appt.serviceType}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            <strong>Requested Time:</strong> {new Date(appt.date).toLocaleDateString()} at {appt.time}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            <strong>Assigned Doctor:</strong> {appt.vet?.name || 'Unassigned'}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ 
            fontSize: '12px', 
            padding: '4px 12px', 
            borderRadius: '12px',
            textTransform: 'uppercase',
            fontWeight: 700,
            background: appt.status === 'confirmed' ? '#dcfce7' : 
                        appt.status === 'declined' ? '#fee2e2' : '#fef3c7',
            color: appt.status === 'confirmed' ? '#166534' : 
                   appt.status === 'declined' ? '#991b1b' : '#92400e'
          }}>
            {appt.status}
          </span>
        </div>
      </div>

      {appt.hasConflict && isPending && (
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#b91c1c', 
          padding: '12px', 
          borderRadius: '8px',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ⚠️ {appt.conflictMsg}
        </div>
      )}

      {appt.notes && (
        <div style={{ background: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
          <strong>Notes:</strong> {appt.notes}
        </div>
      )}

      {isPending && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button 
            onClick={() => handleUpdateStatus(appt._id, 'confirmed')}
            style={{ 
              padding: '10px 20px', 
              borderRadius: '8px', 
              border: 'none', 
              background: 'var(--green-forest)', 
              color: 'white', 
              fontWeight: 600,
              cursor: 'pointer' 
            }}
          >
            ✓ Approve
          </button>
          <button 
            onClick={() => handleUpdateStatus(appt._id, 'declined')}
            style={{ 
              padding: '10px 20px', 
              borderRadius: '8px', 
              border: 'none', 
              background: '#ef4444', 
              color: 'white', 
              fontWeight: 600,
              cursor: 'pointer' 
            }}
          >
            ✕ Decline
          </button>
        </div>
      )}

      {!isPending && appt.status === 'confirmed' && (
        <div style={{ marginTop: '8px', textAlign: 'right' }}>
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel this appointment? The user will be notified.')) {
                handleUpdateStatus(appt._id, 'declined');
              }
            }}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '6px', 
              border: '1px solid #ef4444', 
              background: 'transparent', 
              color: '#ef4444', 
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Cancel Appointment
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '32px' }}>Appointments Management</h1>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--text-primary)' }}>Pending Approvals</h2>
        {pendingAppointments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No pending appointments.</p>
        ) : (
          pendingAppointments.map(appt => renderAppointmentCard(appt, true))
        )}
      </div>

      <div>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--text-primary)' }}>History</h2>
        {otherAppointments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No appointment history.</p>
        ) : (
          otherAppointments.map(appt => renderAppointmentCard(appt, false))
        )}
      </div>
    </div>
  );
}
