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
    <div className={`card${flat ? ' card--flat' : ''}${className ? ` ${className}` : ''}`} style={style}>
      {(title || extra) && (
        <div className="flex-row" style={{ marginBottom: 12, justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>{title}</h3>
          {extra}
        </div>
      )}
      {children}
    </div>
  )
}
