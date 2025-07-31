import React, { useMemo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Stats } from 'decentraland-ui'
import { formatWeiMANA } from '../../lib/mana'
import { useGetCurrentOrder } from '../../modules/order/hooks'
import Mana from '../Mana/Mana'
import { Props } from './Price.types'

const Price = ({ asset, title }: Props) => {
  const order = useGetCurrentOrder()

  const price = useMemo(() => {
    if ('activeOrderId' in asset) {
      return order?.price
    } else if ('price' in asset) {
      return asset.price
    }
  }, [order, asset])

  if (!price) {
    return null
  }

  return (
    <Stats title={title || t('asset_page.price')}>
      <Mana showTooltip network={asset.network} withTooltip>
        {formatWeiMANA(price)}
      </Mana>
    </Stats>
  )
}

export default React.memo(Price)
