import classNames from 'classnames'
import { Icon } from 'decentraland-ui'
import { Props } from './ErrorBanner.types'
import styles from './ErrorBanner.module.css'

export default function ErrorBanner({ info, className }: Props) {
  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.icon}>
        <Icon name="exclamation triangle" />
      </div>
      <span className={styles.info}>
        {info}
      </span>
    </div>
  )
}
