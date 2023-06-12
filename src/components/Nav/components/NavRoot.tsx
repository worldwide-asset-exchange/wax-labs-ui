import { ReactNode, useEffect, useState } from 'react';
import { MdClose, MdMenu } from 'react-icons/md';
import { useLocation } from 'react-router-dom';

interface NavRootProps {
  children: ReactNode;
}

export function NavRoot({ children }: NavRootProps) {
  const [showMenu, setShowMenu] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setShowMenu(false);
  }, [location]);

  function toggleMenu() {
    setShowMenu(state => !state);
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
  );
}
