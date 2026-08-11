import type { ReactNode } from 'react'

interface Props {
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'plain'
  children: ReactNode
}

export function Tag({ variant = 'primary', children }: Props) {
  return <span className={`tag${variant !== 'primary' ? ` tag--${variant}` : ''}`}>{children}</span>
}
