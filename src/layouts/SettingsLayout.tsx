import { Outlet } from 'react-router-dom'

import { Header } from '@/components/Header'

export function SettingsLayout() {
  return (
    <>
      <Header.Root>
        <Header.Title>Settings</Header.Title>
      </Header.Root>
      <Outlet />
    </>
  )
}
