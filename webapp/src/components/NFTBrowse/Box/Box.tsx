import React from 'react'
import classNames from 'classnames'
import { Props } from './Box.types'
import styles from './Box.module.css'

const Box = (props: Props) => {
  return (
    <div className={classNames(styles.box, props.className)}>
      <div className={styles.header}>{props.header}</div>
      <div className={styles.children}>{props.children}</div>
    </div>
  )
}

export default React.memo(Box)
