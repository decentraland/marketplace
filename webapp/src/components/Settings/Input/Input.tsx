import React from 'react'
import { Props } from './Input.types'
import './Input.css'

const Input = ({ type, value, onChange }: Props) => {
  const Input = type

  return (
    <Input
      className="Input"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default React.memo(Input)
