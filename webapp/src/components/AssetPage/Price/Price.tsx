import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana, Stats } from 'decentraland-ui'
import { formatWeiMANA } from '../../../lib/mana'
import { Props } from './Price.types'

const Price = ({ asset, price, title }: Props) => {
  if (!price) {
    return null
  }

  return (
    <Stats title={title || t('asset_page.price')}>
      <Mana network={asset.network} withTooltip>
        {formatWeiMANA(price)}
      </Mana>
    </Stats>
  )
}

export default React.memo(Price)
