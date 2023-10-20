import { ReactNode } from 'react';
import { NavLink as RouterNavLink, NavLinkProps as RouterNavLinkProps } from 'react-router-dom';

interface NavLinkProps extends RouterNavLinkProps {
  children: ReactNode;
}

export function NavLink({ children, ...restProps }: NavLinkProps) {
  return (
    <RouterNavLink
      {...restProps}
      className="label-1 block rounded-md px-4 py-3 text-low-contrast duration-150 hover:underline aria-[current=page]:bg-subtle aria-[current=page]:text-high-contrast"
    >
      {children}
    </RouterNavLink>
  );
}
