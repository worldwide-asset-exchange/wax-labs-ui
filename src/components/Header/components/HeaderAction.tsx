import { ReactNode } from 'react'

interface HeaderActionProps {
  children: ReactNode
}

export function HeaderAction({ children }: HeaderActionProps) {
  return <div className="flex-none">{children}</div>
}
