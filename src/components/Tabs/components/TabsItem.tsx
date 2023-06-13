import { ReactNode } from 'react';

interface TabsItemProps {
  active?: boolean;
  children: ReactNode;
}

export function TabsItem({ children, active = false }: TabsItemProps) {
  return (
    <div
      aria-current={active}
      className="label-1 flex gap-2 whitespace-nowrap border-b border-transparent p-3 pb-[0.6875rem] text-low-contrast duration-150 hover:border-accent-dark hover:text-accent-dark aria-[current=false]:cursor-pointer aria-[current=true]:border-high-contrast aria-[current=true]:text-high-contrast"
    >
      {children}
    </div>
  );
}
