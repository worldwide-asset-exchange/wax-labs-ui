import { ComponentProps, forwardRef, Ref } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  active?: boolean;
  square?: boolean;
}

function ButtonComponent(
  { variant, type = 'button', active, square, children, ...restProps }: ButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const className = ['btn', variant ?? 'default', square ? 'square' : '', active ? 'active' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} className={className} type={type} {...restProps}>
      {children}
    </button>
  );
}

export const Button = forwardRef(ButtonComponent);
