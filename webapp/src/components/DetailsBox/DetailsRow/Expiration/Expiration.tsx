import { memo } from 'react'

import { NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from '../DetailsRow.types'
import { ExpirationInfo } from './ExpirationInfo'

export const Expiration = (props: Props) => {
  const { asset, order, rental } = props

  return (
    <>
      {order ? (
        asset.category === NFTCategory.WEARABLE ||
        asset.category === NFTCategory.EMOTE ? (
          <ExpirationInfo
            title={t('details_box.expires_at')}
            popupContent={t('details_box.expires_at_info')}
            icon="info circle"
            expirationDate={order.expiresAt}
          />
        ) : (
          <ExpirationInfo
            title={t('details_box.order_expiration')}
            expirationDate={order.expiresAt}
          />
        )
      ) : null}
      {rental ? (
        <ExpirationInfo
          title={t('details_box.rental_expiration')}
          expirationDate={rental.expiration}
        />
      ) : null}
    </>
  )
}

export default memo(Expiration)
