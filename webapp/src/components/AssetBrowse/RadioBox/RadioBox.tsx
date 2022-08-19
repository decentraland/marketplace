import React from 'react'
import { Radio } from 'decentraland-ui'
import { Box } from '../Box'
import { Props } from './RadioBox.types'
import styles from './RadioBox.module.css'

const RadioBox = (props: Props) => {
  const { className, items, value, onClick } = props

  return (
    <Box header={props.header} className={className}>
      {items.map((item, index) => (
        <div
          key={index}
          // className={classNames(styles.item, {
          //   // [styles.active]: !!item.active,
          //   // [styles.disabled]: !!item.disabled
          // })}
          // onClick={() => !item.disabled && item.onClick(item, index)}
        >
          <Radio
            className={styles.radio}
            label={item.name}
            name="radioGroup"
            value={item.value}
            checked={value === item.value}
            onChange={() => onClick(item, index)}
          />
          {/* <div className={styles.title}>{item.title}</div>
          <div className={styles.description}>{item.description}</div> */}
        </div>
      ))}
    </Box>
  )
}

export default React.memo(RadioBox)
