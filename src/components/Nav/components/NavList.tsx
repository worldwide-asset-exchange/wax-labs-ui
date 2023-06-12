import { ReactNode } from 'react'

interface NavListProps {
  children: ReactNode
}

export function NavList({ children }: NavListProps) {
  return (
    <ul className="flex gap-2 max-md:absolute max-md:left-0 max-md:top-0 max-md:mt-20 max-md:h-[calc(100vh-5rem)] max-md:w-full max-md:flex-col max-md:gap-4 max-md:bg-app max-md:p-4 group-data-[status=hidden]/nav:max-md:hidden">
      {children}
    </ul>
  )
}
