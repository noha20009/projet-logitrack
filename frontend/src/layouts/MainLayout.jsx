import { useState } from 'react'
import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar'

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box sx={{ flexGrow: 1, minWidth: 0, ml: { md: `${SIDEBAR_WIDTH}px` } }}>
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <Box component="main" sx={{ p: { xs: 2, md: 3 } }}>
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  )
}
