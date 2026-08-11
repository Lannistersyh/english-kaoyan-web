import type { ReactNode } from 'react'

interface Props {
  title: string
  onClose: () => void
  footer?: ReactNode
  children: ReactNode
}

export function Modal({ title, onClose, footer, children }: Props) {
  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__title">{title}</div>
        <div>{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  )
}
