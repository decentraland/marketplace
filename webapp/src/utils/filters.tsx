import { Network } from '@dcl/schemas'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from '../components/Mana'

export function getPriceLabel(minPrice?: string, maxPrice?: string, network?: Network) {
  const manaTranslator = () => (
    <Mana
      className={classNames('mana-label-icon', {
        'mana-label-range': minPrice && maxPrice
      })}
      network={network}
    />
  )

  if (!minPrice && !maxPrice) {
    return t('nft_filters.price.all_items')
  }

  if (minPrice && !maxPrice) {
    return t('nft_filters.price.more_than_price', {
      price: minPrice,
      mana: manaTranslator
    })
  }

  if (maxPrice && !minPrice) {
    return t('nft_filters.price.less_than_price', {
      price: maxPrice,
      mana: manaTranslator
    })
  }

  return t('nft_filters.price.price_between', {
    minPrice,
    maxPrice,
    mana: manaTranslator
  })
}
