import { ReactNode } from 'react';

interface TabsRootProps {
  children: ReactNode;
}

export function TabsRoot({ children }: TabsRootProps) {
  return <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto border-b border-subtle-light">{children}</div>;
}
