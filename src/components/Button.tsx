import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link'
  to?: string
  active?: boolean
  square?: boolean
  children: ReactNode
}

export function Button({ variant, to, active, square, children, ...props }: ButtonProps) {
  const className = ['btn', variant ?? 'default', square ? 'square' : '', active ? 'active' : '']
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (to) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    )
  }

  return (
    <button className={className} type={props.type ?? 'button'} {...props}>
      {children}
    </button>
  )
}
