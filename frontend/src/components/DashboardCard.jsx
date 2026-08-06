import './DashboardCard.css'

export default function DashboardCard({ title, value, icon, color = 'primary' }) {
  return (
    <div className="ui-card dashboard-card">
      <span className={`dashboard-card-avatar dashboard-card-avatar--${color}`}>{icon}</span>
      <div>
        <div className="dashboard-card-value">{value}</div>
        <div className="dashboard-card-title">{title}</div>
      </div>
    </div>
  )
}
