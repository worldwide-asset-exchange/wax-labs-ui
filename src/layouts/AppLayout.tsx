import { Outlet } from 'react-router-dom'

import { AppBar } from '@/components/AppBar'
import { Footer } from '@/components/Footer'

export function AppLayout() {
  return (
    <>
      <AppBar />
      <Outlet />
      <Footer />
    </>
  )
}
