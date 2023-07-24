import { ReactNode } from 'react';

interface TabsRootProps {
  smallSize?: boolean;
  children: ReactNode;
}

export function TabsRoot({ smallSize = false, children }: TabsRootProps) {
  return (
    <div
      data-small-size={smallSize}
      className="mx-auto flex gap-2 overflow-x-auto border-b border-subtle-light p-px data-[small-size=false]:max-w-7xl data-[small-size=true]:max-w-5xl"
    >
      {children}
    </div>
  );
}
