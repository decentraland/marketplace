import React from 'react'
import classNames from 'classnames'
import { Props } from './IconBadge.types'
import './IconBadge.css'

const IconBadge = ({ icon, text, onClick }: Props) => {
  return (
    <div className="IconBadge" onClick={onClick}>
      <span className={classNames('icon', icon)} />
      <span className="text">{text}</span>
    </div>
  )
}

export default React.memo(IconBadge)
