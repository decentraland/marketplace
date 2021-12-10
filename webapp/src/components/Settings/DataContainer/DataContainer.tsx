import React from 'react'
import { Props } from './DataContainer.types'
import './DataContainer.css'

const DataContainer = ({ title, children }: Props) => {
  return (
    <div className="DataContainer">
      <div className="title">{title}</div>
      {children}
    </div>
  )
}

export default React.memo(DataContainer)
