import React from 'react'
import { Props } from './Badge.types'
import './Badge.css'

const Badge = (props: Props) => {
  return (
    <div className="Badge" style={{ backgroundColor: props.color }}>
      {props.children}
    </div>
  )
}

export default React.memo(Badge)
