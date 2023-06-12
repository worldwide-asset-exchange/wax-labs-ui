import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  href?: string;
  to?: string;
  active?: boolean;
  square?: boolean;
  children: ReactNode;
}

export function Link({ variant, href, to, active, square, children }: LinkProps) {
  const className = ['btn', variant ?? 'link', square ? 'square' : '', active ? 'active' : '']
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (href) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <RouterLink className={className} to={to}>
        {children}
      </RouterLink>
    );
  }
}
