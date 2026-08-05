import { Avatar, Box, Card, Typography } from '@mui/material'
import './DashboardCard.css'

export default function DashboardCard({ title, value, icon, color = 'primary' }) {
  return (
    <Card className="dashboard-card">
      <Avatar variant="rounded" className={`dashboard-card-avatar dashboard-card-avatar--${color}`}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h4" className="dashboard-card-value">
          {value}
        </Typography>
        <Typography variant="body2" className="dashboard-card-title">
          {title}
        </Typography>
      </Box>
    </Card>
  )
}
