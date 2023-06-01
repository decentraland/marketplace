import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Stats } from 'decentraland-ui'
import Mana from '../Mana/Mana'
import { formatWeiMANA } from '../../lib/mana'
import { Props } from './Price.types'

const Price = ({ asset, price, title }: Props) => {
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
