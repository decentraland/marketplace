import React from 'react'

import { Props } from './Column.types'
import './Column.css'

const Column = (props: Props) => {
  const { className, align, grow, shrink, children, onClick } = props

  const classNames = ['Column', align]
  if (className) {
    classNames.push(className)
  }
  if (grow) {
    classNames.push('grow')
  }
  if (shrink) {
    classNames.push('shrink')
  }

  return (
    <div className={classNames.join(' ')} onClick={onClick}>
      {children}
    </div>
  )
}

Column.defaultProps = {
  align: 'left',
  className: '',
  grow: false,
  shrink: false
}

export default React.memo(Column)
