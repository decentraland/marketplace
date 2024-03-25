import React from 'react'
import { isValid } from 'date-fns'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Icon } from 'decentraland-ui'
import { formatDistanceToNow } from '../../../lib/date'
import { isLegacyOrder } from '../../../lib/orders'
import { Props } from './Expiration.types'
import styles from './Expiration.module.css'

const Expiration = ({ order }: Props) => {
  if (!order) {
    return null
  }

  // The expiration could be set to a really big and unsupported number.
  // If the expiration has an unsupported value, don't show it.
  if (!isValid(order.expiresAt)) {
    return null
  }

  return (
    <div className={styles.container}>
      <Icon name="clock outline" />
      {t('asset_page.expires')}{' '}
      {formatDistanceToNow(order.expiresAt * (isLegacyOrder(order) ? 1 : 1000), {
        addSuffix: true
      })}
    </div>
  )
}

export default React.memo(Expiration)
