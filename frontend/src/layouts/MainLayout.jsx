import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import './MainLayout.css'

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="main-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-layout-content">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="main-layout-main">
          <div className="main-layout-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
