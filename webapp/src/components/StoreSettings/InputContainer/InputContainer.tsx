import React from 'react'
import { Props } from './InputContainer.types'
import './InputContainer.css'

const InputContainer = ({ title, children }: Props) => {
  return (
    <div className="InputContainer">
      <div className="title">{title}</div>
      {children}
    </div>
  )
}

export default React.memo(InputContainer)
