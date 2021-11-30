import React from 'react'
import { Props } from './IconBadge.types'
import classNames from 'classnames'

import styles from './IconBadge.module.css'
import './IconBadge.css'

const IconBadge = ({ icon, text, onClick }: Props) => {
  return (
    <div className={classNames(styles.badge, 'IconBadge')} onClick={onClick}>
      <span className={classNames(styles.icon, icon)} />
      <span className={styles.text}>{text}</span>
    </div>
  )
}

export default React.memo(IconBadge)
