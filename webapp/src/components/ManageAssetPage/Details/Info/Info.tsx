import { memo } from 'react'
import { Props } from './Info.types'
import styles from './Info.module.css'

export const Info = ({ title, children }: Props) => (
  <div className={styles.info}>
    <div className={styles.infoTitle}>{title}</div>
    <div className={styles.infoContent}>{children}</div>
  </div>
)

export default memo(Info)
