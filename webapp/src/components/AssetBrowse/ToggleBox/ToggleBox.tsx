import React from 'react'
import classNames from 'classnames'
import { useMobileMediaQuery } from 'decentraland-ui'
import { Box } from '../Box'
import { Props } from './ToggleBox.types'
import styles from './ToggleBox.module.css'

const ToggleBox = (props: Props) => {
  const { className, items, direction } = props
  const isMobile = useMobileMediaQuery()

  return (
    <Box header={props.header} className={className} childrenClassName={direction && direction === 'row' ? styles.flex : undefined}>
      {items.map((item, index) => (
        <div
          key={index}
          className={classNames(styles.item, {
            [styles.active]: !!item.active,
            [styles.disabled]: !!item.disabled,
            [styles.flex]: !!direction && direction === 'row'
          })}
          onClick={() => !item.disabled && item.onClick(item, index)}
        >
          {item.icon}
          <div>
            <div className={styles.title}>{item.title}</div>
            {isMobile && direction === 'row' ? null : <div className={styles.description}>{item.description}</div>}
          </div>
        </div>
      ))}
    </Box>
  )
}

export default React.memo(ToggleBox)
