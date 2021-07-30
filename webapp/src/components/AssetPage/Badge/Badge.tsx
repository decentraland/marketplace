import React from 'react'
import { Props } from './Badge.types'
import './Badge.css'

const Badge = (props: Props) => {
  const { color, className = '', children } = props
  return (
    <div className={`${className} Badge`} style={{ backgroundColor: color }}>
      {children}
    </div>
  )
}

export default React.memo(Badge)
