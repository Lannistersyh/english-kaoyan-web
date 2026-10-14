import type { ReactNode } from 'react'

interface Props {
  icon?: string
  title?: string
  children?: ReactNode
}

export function EmptyState({ icon = '📭', title = "No content yet", children }: Props) {
  return (
    <div className="empty">
      <div className="empty__icon">{icon}</div>
      <div className="empty__title">{title}</div>
      {children && <div className="muted" style={{ marginTop: 6 }}>{children}</div>}
    </div>
  )
}
