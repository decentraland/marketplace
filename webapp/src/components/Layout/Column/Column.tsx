import React from 'react'
import classnames from 'classnames'

import { Props } from './Column.types'
import './Column.css'

const Column = (props: Props) => {
  const { className, align, grow, shrink, children, onClick } = props
  const classes = classnames('Column', align, className, {
    grow,
    shrink
  })

  return (
    <div className={classes} onClick={onClick}>
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
