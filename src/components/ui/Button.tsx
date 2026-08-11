import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'danger' | 'ghost'
  children: ReactNode
}

export function Button({ variant = 'default', className = '', children, ...rest }: Props) {
  const cls = `btn${variant !== 'default' ? ` btn--${variant}` : ''}${className ? ` ${className}` : ''}`
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}
