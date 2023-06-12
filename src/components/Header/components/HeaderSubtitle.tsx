import { ReactNode } from 'react'

interface HeaderSubtitleProps {
  children: ReactNode
}

export function HeaderSubtitle({ children }: HeaderSubtitleProps) {
  return <p className="body-1 text-low-contrast">{children}</p>
}
