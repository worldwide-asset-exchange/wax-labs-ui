import { Outlet } from 'react-router-dom'

import { Header } from '@/components/Header'
import string from '@/resources/strings'

export function SettingsLayout() {
  return (
    <>
      <Header.Root>
        <Header.Title>{string.settings}</Header.Title>
      </Header.Root>
      <Outlet />
    </>
  )
}
