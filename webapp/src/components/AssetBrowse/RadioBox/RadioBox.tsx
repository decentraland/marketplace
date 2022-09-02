import React from 'react'
import classNames from 'classnames'
import { Radio } from 'decentraland-ui'
import { Box } from '../Box'
import { Props } from './RadioBox.types'
import styles from './RadioBox.module.css'

const RadioBox = (props: Props) => {
  const { className, items, value, onClick } = props

  return (
    <Box header={props.header} className={classNames(className, styles.box)}>
      {items.map((item, index) => (
        <div key={index}>
          <Radio
            className={styles.radio}
            label={item.name}
            name="radioGroup"
            value={item.value}
            checked={value === item.value}
            onChange={() => onClick(item, index)}
          />
        </div>
      ))}
    </Box>
  )
}

export default React.memo(RadioBox)
