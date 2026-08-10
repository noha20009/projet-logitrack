import './DashboardCard.css'

export default function DashboardCard({ title, value, icon, color = 'primary' }) {
  const isNumber = typeof value === 'number'
  return (
    <div className={`dashboard-card dashboard-card--${color}`}>
      <div className="dashboard-card-header">
        <span className="dashboard-card-icon">{icon}</span>
        <h3 className="dashboard-card-title">{title}</h3>
      </div>
      <div className={`dashboard-card-value${isNumber ? '' : ' dashboard-card-value--text'}`}>{value}</div>
    </div>
  )
}
