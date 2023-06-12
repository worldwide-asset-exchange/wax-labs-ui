import { ReactNode } from 'react'

interface HeaderContentProps {
  children: ReactNode
}

export function HeaderContent({ children }: HeaderContentProps) {
  return <div className="flex-1">{children}</div>
}
