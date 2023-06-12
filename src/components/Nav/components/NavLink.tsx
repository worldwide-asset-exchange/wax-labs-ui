import { ReactNode } from 'react'
import { NavLink as RouterNavLink } from 'react-router-dom'

interface NavLinkProps {
  to: string
  children: ReactNode
}

export function NavLink({ to, children }: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      className="label-1 block rounded-md px-4 py-3 text-low-contrast duration-150 hover:underline focus:outline-none focus:ring-1 focus:ring-accent-dark aria-[current=page]:bg-subtle aria-[current=page]:text-high-contrast"
    >
      {children}
    </RouterNavLink>
  )
}
