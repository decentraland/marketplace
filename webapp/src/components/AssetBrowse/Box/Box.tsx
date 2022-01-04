import React from 'react'
import classNames from 'classnames'
import { Props } from './Box.types'
import styles from './Box.module.css'

const Box = ({ className, header, children, childrenClassName }: Props) => {
  return (
    <div className={classNames(styles.box, className)}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={classNames(styles.children, childrenClassName)}>
        {children}
      </div>
    </div>
  )
}

export default React.memo(Box)
