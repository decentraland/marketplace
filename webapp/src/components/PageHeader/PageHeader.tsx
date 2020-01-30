import React from 'react'

import { Props } from './PageHeader.types'
import './PageHeader.css'

const PageHeader = (props: Props) => (
  <div className="PageHeader" style={props.style}>
    {props.children}
  </div>
)

export default React.memo(PageHeader)
