import { ReactNode } from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link'
  type?: 'button' | 'submit'
  disabled?: boolean
  active?: boolean
  square?: boolean
  onClick?: () => void
  children: ReactNode
}

export function Button({ variant, type = 'button', active, square, disabled, children }: ButtonProps) {
  const className = ['btn', variant ?? 'default', square ? 'square' : '', active ? 'active' : '']
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <button className={className} type={type} disabled={disabled}>
      {children}
    </button>
  )
}
