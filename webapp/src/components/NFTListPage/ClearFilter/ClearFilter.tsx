import React from 'react'

import { Props } from './ClearFilter.types'
import './ClearFilter.css'

const ClearFilter = (props: Props) => {
  const { name, onClear } = props
  return (
    <div className="ClearFilter" onClick={onClear}>
      <div className="name">{name}</div>
      <div className="close" />
    </div>
  )
}

export default ClearFilter
