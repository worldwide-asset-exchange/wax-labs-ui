import { ReactNode, useEffect, useState } from 'react'
import { MdClose, MdMenu } from 'react-icons/md'
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom'

interface NavRootProps {
  children: ReactNode
}

function NavRoot({ children }: NavRootProps) {
  const [showMenu, setShowMenu] = useState(false)

  const location = useLocation()

  useEffect(() => {
    setShowMenu(false)
  }, [location])

  function toggleMenu() {
    setShowMenu((state) => !state)
  }

  return (
    <nav data-status={showMenu ? 'visible' : 'hidden'} className="group/nav flex gap-2">
      <button
        type="button"
        onClick={toggleMenu}
        className="label-1 z-10 block rounded-md px-4 py-3 text-low-contrast duration-150 focus:outline-none focus:ring-1 focus:ring-accent-dark md:hidden"
      >
        {showMenu ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>
      {children}
    </nav>
  )
}

interface NavListProps {
  children: ReactNode
}

function NavList({ children }: NavListProps) {
  return (
    <ul className="flex gap-2 max-md:absolute max-md:left-0 max-md:top-0 max-md:mt-20 max-md:h-[calc(100vh-5rem)] max-md:w-full max-md:flex-col max-md:gap-4 max-md:bg-app max-md:p-4 group-data-[status=hidden]/nav:max-md:hidden">
      {children}
    </ul>
  )
}

interface NavItemProps {
  children: ReactNode
}

function NavItem({ children }: NavItemProps) {
  return <li>{children}</li>
}

interface NavLinkProps {
  to: string
  children: ReactNode
}

function NavLink({ to, children }: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      className="label-1 block rounded-md px-4 py-3 text-low-contrast duration-150 hover:underline focus:outline-none focus:ring-1 focus:ring-accent-dark aria-[current=page]:bg-subtle aria-[current=page]:text-high-contrast"
    >
      {children}
    </RouterNavLink>
  )
}

interface NavButtonProps {
  onClick: () => void
  children: ReactNode
}

function NavButton({ onClick, children }: NavButtonProps) {
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

export const Nav = {
  Root: NavRoot,
  List: NavList,
  Item: NavItem,
  Link: NavLink,
  Button: NavButton
}
