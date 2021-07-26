import React from 'react'
import classNames from 'classnames'
import { Box } from '../Box'
import { Props } from './ToggleBox.types'
import styles from './ToggleBox.module.css'

const ToggleBox = (props: Props) => {
  const { items, active } = props

  return (
    <Box header={props.header}>
      {items.map((item, index) => (
        <div
          key={index}
          className={classNames(styles.item, {
            [styles.active]: index === active
          })}
          onClick={() => item.onClick(item, index)}
        >
          <div className={styles.title}>{item.title}</div>
          <div className={styles.description}>{item.description}</div>
        </div>
      ))}
    </Box>
  )
}

export default React.memo(ToggleBox)
