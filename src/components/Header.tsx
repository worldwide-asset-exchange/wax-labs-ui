import { ReactNode } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'

interface HeaderRootProps {
  children: ReactNode
}

function HeaderRoot({ children }: HeaderRootProps) {
  return <header className="mx-auto flex max-w-7xl items-center px-4 py-8">{children}</header>
}

interface HeaderContentProps {
  children: ReactNode
}

function HeaderContent({ children }: HeaderContentProps) {
  return <div className="flex-1">{children}</div>
}

interface HeaderTitleProps {
  children: ReactNode
}

function HeaderTitle({ children }: HeaderTitleProps) {
  return <h1 className="title-1 text-high-contrast">{children}</h1>
}

interface HeaderButtonProps {
  children: ReactNode
  onClick: () => void
}

function HeaderButton({ children, onClick }: HeaderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-ml-2 flex flex-nowrap items-center gap-2 whitespace-nowrap rounded-md px-2 py-1 duration-150 hover:bg-subtle focus:ring-1 focus:ring-accent-dark"
    >
      <h1 className="title-2 text-high-contrast">{children}</h1>
      <MdKeyboardArrowDown size={24} className="text-accent" />
    </button>
  )
}

interface HeaderSubtitleProps {
  children: ReactNode
}

function HeaderSubtitle({ children }: HeaderSubtitleProps) {
  return <p className="body-1 text-low-contrast">{children}</p>
}

interface HeaderActionProps {
  children: ReactNode
}

function HeaderAction({ children }: HeaderActionProps) {
  return <div className="flex-none">{children}</div>
}

export const Header = {
  Root: HeaderRoot,
  Content: HeaderContent,
  Title: HeaderTitle,
  Button: HeaderButton,
  Subtitle: HeaderSubtitle,
  Action: HeaderAction
}
