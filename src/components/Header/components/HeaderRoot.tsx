import { ReactNode } from 'react';

interface HeaderRootProps {
  children: ReactNode;
}

export function HeaderRoot({ children }: HeaderRootProps) {
  return <header className="mx-auto flex max-w-7xl items-center px-4 py-8">{children}</header>;
}
