import React from 'react'
import { Props } from './Element.types'
import styles from './Element.module.css'

const Element = ({ title, input, inputType, onChange }: Props) => {
  const Input = inputType

  return (
    <div className={styles.element}>
      <div className={styles.title}>{title}</div>
      <Input
        className={styles.input}
        value={input}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

export default React.memo(Element)
