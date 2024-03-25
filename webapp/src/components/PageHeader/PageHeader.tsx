import React from 'react'
import classNames from 'classnames'
import { Props } from './PageHeader.types'
import './PageHeader.css'

const PageHeader = ({ style, className, children }: Props) => (
  <div className={classNames('PageHeader', className)} style={style}>
    {children}
  </div>
)

export default React.memo(PageHeader)
