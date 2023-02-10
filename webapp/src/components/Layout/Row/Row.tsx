import React from 'react'
import classNames from 'classnames'
import { Props } from './Row.types'
import './Row.css'

const Row = (props: Props) => {
  const { className, children, onClick } = props

  return (
    <div className={classNames('Row', className)} onClick={onClick}>
      {children}
    </div>
  )
}

Row.defaultProps = {
  className: ''
}

export default React.memo(Row)
