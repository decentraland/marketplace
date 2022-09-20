import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Props } from './IconBadge.types'
import './IconBadge.css'

const IconBadge = ({
  icon,
  text,
  onClick,
  href,
  className,
  children
}: Props) => {
  const childrenInt = React.useMemo(
    () => (
      <>
        {children ? (
          <span className="custom-icon">{children}</span>
        ) : (
          <span className={classNames(icon && 'icon', icon)} />
        )}
        <span className="text">{text}</span>
      </>
    ),
    [children, icon, text]
  )

  return href ? (
    <Link
      className={classNames('IconBadge', className)}
      onClick={onClick}
      to={href}
    >
      {childrenInt}
    </Link>
  ) : (
    <div className={classNames('IconBadge', className)} onClick={onClick}>
      {childrenInt}
    </div>
  )
}

export default React.memo(IconBadge)
