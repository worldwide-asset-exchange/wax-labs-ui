import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  newWindow?: boolean;
  to: string;
  active?: boolean;
  square?: boolean;
  children: ReactNode;
}

export function Link({ variant, newWindow, to, active, square, children }: LinkProps) {
  const className = ['btn', variant ?? 'link', square ? 'square' : '', active ? 'active' : '']
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <RouterLink className={className} to={to} target={newWindow ? '_blank' : '_self'}>
      {children}
    </RouterLink>
  );
}
