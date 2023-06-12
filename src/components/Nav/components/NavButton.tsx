import { ReactNode } from 'react'

interface NavButtonProps {
  onClick: () => void
  children: ReactNode
}

export function NavButton({ onClick, children }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="label-1 block rounded-md px-4 py-3 text-low-contrast duration-150 hover:bg-subtle hover:text-high-contrast focus:outline-none focus:ring-1 focus:ring-accent-dark"
    >
      {children}
    </button>
  )
}
