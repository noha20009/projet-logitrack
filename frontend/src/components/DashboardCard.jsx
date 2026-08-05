import { Avatar, Box, Card, Typography } from '@mui/material'

export default function DashboardCard({ title, value, icon, color = 'primary' }) {
  return (
    <Card sx={{ p: 2.5, height: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        variant="rounded"
        sx={{
          width: 48,
          height: 48,
          bgcolor: `${color}.main`,
          color: 'white',
        }}
      >
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h4" sx={{ lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Card>
  )
}
