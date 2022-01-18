import React from 'react'
import classNames from 'classnames'
import { Props } from './IconBadge.types'
import './IconBadge.css'

const IconBadge = ({ icon, text, onClick, className, children }: Props) => {
  return (
    <div className={classNames('IconBadge', className)} onClick={onClick}>
      {children ? (
        <span className="custom-icon">{children}</span>
      ) : (
        <span className={classNames('icon', icon)} />
      )}
      <span className="text">{text}</span>
    </div>
  )
}

export default React.memo(IconBadge)
