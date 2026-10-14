import type { CSSProperties, ReactNode } from 'react'

interface Props {
  title?: ReactNode
  extra?: ReactNode
  flat?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function Card({ title, extra, flat, className = '', style, children }: Props) {
  return (
    <div className={`card${title || extra ? ' card--section' : ''}${flat ? ' card--flat' : ''}${className ? ` ${className}` : ''}`} style={style}>
      {(title || extra) && (
        <div className="flex-row card__header">
          {title && <h2 className="card__title">{title}</h2>}
          {extra}
        </div>
      )}
      {children}
    </div>
  )
}
