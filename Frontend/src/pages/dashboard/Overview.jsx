import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../api';

/* Quick stat card */
function StatCard({ icon, label, value, color, trend }) {
  return (
    <div className="dash-stat-card" style={{ '--stat-color': color }}>
      <div className="dash-stat-icon">{icon}</div>
      <div className="dash-stat-body">
        <span className="dash-stat-value">{value}</span>
        <span className="dash-stat-label">{label}</span>
      </div>
      {trend && <span className="dash-stat-trend">{trend}</span>}
    </div>
  );
}

/* Upcoming appointment row */
function ApptRow({ dateStr, time, vetName, service, petName, status }) {
  const statusColor = {
    confirmed: { bg: 'rgba(45,122,79,0.1)', color: '#2d7a4f', label: 'Upcoming' },
    today:    { bg: 'rgba(233,168,76,0.12)', color: '#c17a10', label: 'Today' },
    completed:{ bg: 'rgba(82,183,136,0.12)', color: '#40916c', label: 'Completed' },
  }[status] || { bg: 'rgba(45,122,79,0.1)', color: '#2d7a4f', label: status };

  const parts = dateStr.split(' ');

  return (
    <div className="dash-appt-row">
      <div className="dash-appt-date-col">
        <span className="dash-appt-day">{parts[1] || ''}</span>
        <span className="dash-appt-month">{parts[0] || ''}</span>
      </div>
      <div className="dash-appt-info">
        <span className="dash-appt-service">{service}</span>
        <span className="dash-appt-meta">{vetName} · {petName} · {time}</span>
      </div>
      <span className="dash-appt-badge" style={{ background: statusColor.bg, color: statusColor.color }}>
        {statusColor.label}
      </span>
    </div>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsRes, apptRes] = await Promise.all([
          api.get('/api/pets'),
          api.get('/api/appointments/my')
        ]);
        setPets(petsRes.data);
        setAppointments(apptRes.data);
      } catch (error) {
        console.error('Failed to fetch overview data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '40px' }}>Loading overview...</div>;

  const confirmedAppts = appointments.filter(a => a.status === 'confirmed');
  const completedAppts = appointments.filter(a => a.status === 'completed');
  const vacDue = pets.filter(p => !p.isVaccinated).length;

  const stats = [
    { icon: '🐾', label: 'My Pets', value: pets.length, color: '#2d7a4f', trend: '' },
    { icon: '📅', label: 'Upcoming Appointments', value: confirmedAppts.length, color: '#e9a84c', trend: '' },
    { icon: '💉', label: 'Vaccinations Due', value: vacDue, color: '#d4704a', trend: vacDue > 0 ? '⚠️ Soon' : '' },
    { icon: '📋', label: 'Medical Records', value: completedAppts.length, color: '#40916c', trend: '' },
  ];

  // Map real upcoming appointments for the list
  const upcomingList = confirmedAppts.slice(0, 3).map(a => {
    const d = new Date(a.date);
    return {
      dateStr: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      time: a.time,
      vetName: a.vet?.name || 'Any Doctor',
      service: a.serviceType || a.reason,
      petName: a.pet?.name || 'Pet',
      status: a.status
    };
  });

  // Generate dynamic recent activity
  const recentActivity = [];
  
  // Add recent pets
  [...pets].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 2).forEach(p => {
    recentActivity.push({
      icon: '🐾',
      text: `Added pet profile for ${p.name}`,
      time: new Date(p.createdAt).toLocaleDateString(),
      sortTime: new Date(p.createdAt).getTime()
    });
  });

  // Add recent appointments (completed or confirmed)
  [...appointments].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3).forEach(a => {
    let text = `Booked ${a.serviceType} for ${a.pet?.name}`;
    let icon = '📅';
    if (a.status === 'completed') {
      text = `Completed ${a.serviceType} for ${a.pet?.name}`;
      icon = '✅';
    } else if (a.status === 'declined') {
      text = `Appointment declined for ${a.pet?.name}`;
      icon = '❌';
    }
    recentActivity.push({
      icon,
      text,
      time: new Date(a.createdAt).toLocaleDateString(),
      sortTime: new Date(a.createdAt).getTime()
    });
  });

  // Sort activity by time
  recentActivity.sort((a, b) => b.sortTime - a.sortTime);

  return (
    <div className="dash-page" id="overview-page">
      {/* Welcome Banner */}
      <div className="dash-welcome-banner">
        <div className="dash-welcome-text">
          <h1 className="dash-welcome-title">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="dash-welcome-sub">
            Here's what's happening with your pets today.
          </p>
        </div>
        <div className="dash-welcome-pets">
          <span style={{ fontSize: 40 }}>🐕</span>
          <span style={{ fontSize: 40 }}>🐈</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="dash-stats-grid">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Two-column layout */}
      <div className="dash-overview-grid">
        {/* Upcoming Appointments */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2 className="dash-panel-title">Upcoming Appointments</h2>
            <Link to="/dashboard/appointments" className="dash-panel-link">View all →</Link>
          </div>
          <div className="dash-appt-list">
            {upcomingList.length > 0 ? upcomingList.map((a, i) => <ApptRow key={i} {...a} />) : (
              <p style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>No upcoming appointments.</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2 className="dash-panel-title">Recent Activity</h2>
          </div>
          <ul className="dash-activity-list">
            {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((item, i) => (
              <li key={i} className="dash-activity-item">
                <span className="dash-activity-icon">{item.icon}</span>
                <div className="dash-activity-body">
                  <span className="dash-activity-text">{item.text}</span>
                  <span className="dash-activity-time">{item.time}</span>
                </div>
              </li>
            )) : (
              <p style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>No recent activity yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
