import { ComponentProps } from 'react';

interface TabsItemProps extends ComponentProps<'div'> {
  active?: boolean;
}

export function TabsItem({ children, active = false, ...otherProps }: TabsItemProps) {
  return (
    <div
      aria-current={active}
      className="label-1 -mb-px flex gap-2 whitespace-nowrap border-b border-transparent px-3 pb-2.5 pt-[0.6875rem] text-low-contrast duration-150 hover:border-accent-dark hover:text-accent-dark aria-[current=false]:cursor-pointer aria-[current=true]:border-high-contrast aria-[current=true]:text-high-contrast"
      {...otherProps}
    >
      {children}
    </div>
  );
}
