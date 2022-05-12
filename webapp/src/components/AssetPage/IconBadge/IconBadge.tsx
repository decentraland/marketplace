import React from 'react'
import classNames from 'classnames'
import { Props } from './IconBadge.types'
import './IconBadge.css'
import { Link } from 'react-router-dom'

const IconBadge = ({ icon, text, onClick, href, className, children }: Props) => {

  const childrenInt = React.useMemo(() => (
    <>
      {children ? (
        <span className="custom-icon">{children}</span>
      ) : (
        <span className={classNames('icon', icon)} />
      )}
      <span className="text">{text}</span></>
  ), [children, icon, text])

  if (href) {
    return (
      <Link className={classNames('IconBadge', className)} onClick={onClick} to={href}>
        {childrenInt}
      </Link>
    )
  } else {
    return (
      <div className={classNames('IconBadge', className)} onClick={onClick}>
        {childrenInt}
      </div>
    )
  }
}

export default React.memo(IconBadge)
