import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { Icon } from 'decentraland-ui'
import './FilterPopover.css'

export type FilterPopoverProps = {
  /** Text shown on the trigger button. */
  label: string
  /** When true the trigger is highlighted to signal an active selection. */
  active?: boolean
  /** Optional summary (e.g. selected count) rendered next to the label. */
  badge?: ReactNode
  className?: string
  /** Panel content. If a function, it receives a `close` callback. */
  children: ReactNode | ((close: () => void) => ReactNode)
}

export const FilterPopover = ({ label, active, badge, className, children }: FilterPopoverProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className={classNames('FilterPopover', { 'is-open': open, 'is-active': active }, className)}>
      <button type="button" className="FilterPopover__trigger" onClick={() => setOpen(prev => !prev)} aria-expanded={open}>
        <span className="FilterPopover__label">{label}</span>
        {badge ? <span className="FilterPopover__badge">{badge}</span> : null}
        <Icon name="chevron down" className="FilterPopover__chevron" />
      </button>
      {open ? (
        <div className="FilterPopover__panel" role="dialog">
          {typeof children === 'function' ? children(close) : children}
        </div>
      ) : null}
    </div>
  )
}

export default FilterPopover
