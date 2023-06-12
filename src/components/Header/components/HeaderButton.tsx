import { ReactNode } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface HeaderButtonProps {
  children: ReactNode;
  onClick: () => void;
}

export function HeaderButton({ children, onClick }: HeaderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-ml-2 flex flex-nowrap items-center gap-2 whitespace-nowrap rounded-md px-2 py-1 duration-150 hover:bg-subtle focus:ring-1 focus:ring-accent-dark"
    >
      <h1 className="title-2 text-high-contrast">{children}</h1>
      <MdKeyboardArrowDown size={24} className="text-accent" />
    </button>
  );
}
