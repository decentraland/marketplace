import React from 'react'

import { Props } from './PageHeader.types'
import './PageHeader.css'
import classNames from 'classnames'

const PageHeader = ({ style, className, children }: Props) => (
  <div className={classNames('PageHeader', className)} style={style}>
    {children}
  </div>
)

export default React.memo(PageHeader)
