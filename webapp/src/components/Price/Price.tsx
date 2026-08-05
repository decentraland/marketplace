import React, { useMemo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Stats } from 'decentraland-ui'
import { useGetCurrentOrder } from '../../modules/order/hooks'
import { ListingPrice } from '../ListingPrice'
import { Props } from './Price.types'

const Price = ({ asset, title }: Props) => {
  const order = useGetCurrentOrder()

  const listing = useMemo(() => {
    if ('activeOrderId' in asset) {
      return order ? { price: order.price, tradeId: order.tradeId } : undefined
    } else if ('price' in asset) {
      return { price: asset.price, tradeId: 'tradeId' in asset ? asset.tradeId : undefined }
    }
  }, [order, asset])

  if (!listing?.price) {
    return null
  }

  return (
    <Stats title={title || t('asset_page.price')}>
      <ListingPrice price={listing.price} network={asset.network} tradeId={listing.tradeId} showTooltip />
    </Stats>
  )
}

export default React.memo(Price)
