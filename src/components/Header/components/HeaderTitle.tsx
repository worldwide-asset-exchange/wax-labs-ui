import { ReactNode } from 'react'

interface HeaderTitleProps {
  children: ReactNode
}

export function HeaderTitle({ children }: HeaderTitleProps) {
  return <h1 className="title-1 text-high-contrast">{children}</h1>
}
