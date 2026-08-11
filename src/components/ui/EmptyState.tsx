import type { ReactNode } from 'react'

interface Props {
  icon?: string
  title?: string
  children?: ReactNode
}

export function EmptyState({ icon = '📭', title = '暂无内容', children }: Props) {
  return (
    <div className="empty">
      <div className="empty__icon">{icon}</div>
      <div style={{ fontWeight: 600 }}>{title}</div>
      {children && <div className="muted" style={{ marginTop: 6 }}>{children}</div>}
    </div>
  )
}
