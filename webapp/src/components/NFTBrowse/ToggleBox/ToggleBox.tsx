import React from 'react'
import classNames from 'classnames'
import { Box } from '../Box'
import { Props } from './ToggleBox.types'
import styles from './ToggleBox.module.css'

const ToggleBox = (props: Props) => {
  const { className, items } = props
  return (
    <Box header={props.header} className={className}>
      {items.map((item, index) => (
        <div
          key={index}
          className={classNames(styles.item, {
            [styles.active]: !!item.active,
            [styles.disabled]: !!item.disabled
          })}
          onClick={() => !item.disabled && item.onClick(item, index)}
        >
          <div className={styles.title}>{item.title}</div>
          <div className={styles.description}>{item.description}</div>
        </div>
      ))}
    </Box>
  )
}

export default React.memo(ToggleBox)
