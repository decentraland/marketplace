import React from 'react'
import { Props } from './TextInput.types'
import './TextInput.css'

const TextInput = ({ type, value, onChange }: Props) => {
  const Input = type

  return <Input className="TextInput" value={value} onChange={e => onChange(e.target.value)} />
}

export default React.memo(TextInput)
