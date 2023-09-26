import { forwardRef, Ref, RefAttributes } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

interface LinkProps extends RouterLinkProps, RefAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  active?: boolean;
  square?: boolean;
}

function LinkComponent(
  { variant, active, square, children, ...restProps }: LinkProps,
  ref: Ref<RouterLinkProps & HTMLAnchorElement>
) {
  const className = ['btn', variant ?? 'link', square ? 'square' : '', active ? 'active' : '']
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <RouterLink className={className} ref={ref} {...restProps}>
      {children}
    </RouterLink>
  );
}

export const Link = forwardRef(LinkComponent);
