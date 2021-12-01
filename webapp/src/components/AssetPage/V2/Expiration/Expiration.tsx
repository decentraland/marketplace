import React from 'react'
import { Icon } from 'decentraland-ui'
import { Props } from './Expiration.types'
import { formatDistanceToNow } from '../../../../lib/date'
import styles from './Expiration.module.css'

const Expiration = ({ order }: Props) => {
  if (!order) {
    return null
  }

  return (
    <div className={styles.container}>
      <Icon name="clock outline" />
      Expires{' '}
      {formatDistanceToNow(+order.expiresAt, {
        addSuffix: true
      })}
    </div>
  )
}

export default React.memo(Expiration)
