import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link'
  active?: boolean
  square?: boolean
  children: ReactNode
}

export function Button({ variant, active, square, children, ...props }: ButtonProps) {
  const className = ['btn', variant ?? 'default', square ? 'square' : '', active ? 'active' : '']
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <button className={className} type={props.type ?? 'button'} {...props}>
      {children}
    </button>
  )
}
