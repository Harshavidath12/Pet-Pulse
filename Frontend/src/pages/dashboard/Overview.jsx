import { useAuth } from '../../context/AuthContext';

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
function ApptRow({ date, time, vet, service, pet, status }) {
  const statusColor = {
    upcoming: { bg: 'rgba(45,122,79,0.1)', color: '#2d7a4f', label: 'Upcoming' },
    today:    { bg: 'rgba(233,168,76,0.12)', color: '#c17a10', label: 'Today' },
    completed:{ bg: 'rgba(82,183,136,0.12)', color: '#40916c', label: 'Completed' },
  }[status] || { bg: 'rgba(45,122,79,0.1)', color: '#2d7a4f', label: 'Upcoming' };

  return (
    <div className="dash-appt-row">
      <div className="dash-appt-date-col">
        <span className="dash-appt-day">{date.split(' ')[1]}</span>
        <span className="dash-appt-month">{date.split(' ')[0]}</span>
      </div>
      <div className="dash-appt-info">
        <span className="dash-appt-service">{service}</span>
        <span className="dash-appt-meta">{vet} · {pet} · {time}</span>
      </div>
      <span className="dash-appt-badge" style={{ background: statusColor.bg, color: statusColor.color }}>
        {statusColor.label}
      </span>
    </div>
  );
}

export default function Overview() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { icon: '🐾', label: 'My Pets', value: '2', color: '#2d7a4f', trend: '' },
    { icon: '📅', label: 'Upcoming Appointments', value: '3', color: '#e9a84c', trend: '' },
    { icon: '💉', label: 'Vaccinations Due', value: '1', color: '#d4704a', trend: '⚠️ Soon' },
    { icon: '📋', label: 'Medical Records', value: '8', color: '#40916c', trend: '' },
  ];

  const appointments = [
    { date: 'Jun 15', time: '10:00 AM', vet: 'Dr. Amara Perera', service: 'Annual Checkup', pet: 'Max', status: 'upcoming' },
    { date: 'Jun 22', time: '2:30 PM',  vet: 'Dr. Rohan Silva',  service: 'Dental Cleaning', pet: 'Luna', status: 'upcoming' },
    { date: 'Jul 05', time: '11:00 AM', vet: 'Dr. Amara Perera', service: 'Vaccination Booster', pet: 'Max', status: 'upcoming' },
  ];

  const recentActivity = [
    { icon: '💊', text: 'Flea treatment recorded for Max', time: '2 days ago' },
    { icon: '📸', text: 'Updated Luna\'s profile photo', time: '5 days ago' },
    { icon: '✅', text: 'Completed annual checkup — Luna', time: '1 week ago' },
    { icon: '📋', text: 'New medical record added for Max', time: '2 weeks ago' },
  ];

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
            <a href="/dashboard/appointments" className="dash-panel-link">View all →</a>
          </div>
          <div className="dash-appt-list">
            {appointments.map((a, i) => <ApptRow key={i} {...a} />)}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h2 className="dash-panel-title">Recent Activity</h2>
          </div>
          <ul className="dash-activity-list">
            {recentActivity.map((item, i) => (
              <li key={i} className="dash-activity-item">
                <span className="dash-activity-icon">{item.icon}</span>
                <div className="dash-activity-body">
                  <span className="dash-activity-text">{item.text}</span>
                  <span className="dash-activity-time">{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
