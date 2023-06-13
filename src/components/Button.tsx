import { forwardRef, ReactNode, Ref } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  type?: 'button' | 'submit';
  disabled?: boolean;
  active?: boolean;
  square?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

function ButtonComponent(
  { variant, type = 'button', active, square, disabled, onClick, children }: ButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const className = ['btn', variant ?? 'default', square ? 'square' : '', active ? 'active' : '']
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <button ref={ref} className={className} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

export const Button = forwardRef(ButtonComponent);
