import React from 'react'
import { Mana } from 'decentraland-ui'
import { formatWeiMANA } from '../../lib/mana'
import { PriceDenomination } from '../../modules/trade/denomination'
import { useTradePriceDenomination } from '../../modules/trade/hooks'
import { CreditsPrice } from '../CreditsPrice'
import { ManaToFiat } from '../ManaToFiat'
import { Props } from './ListingPrice.types'

/**
 * One listing price, in whichever unit its trade actually denominates it.
 *
 * The single funnel for the row/list surfaces (listing tables, on-sale lists, collection rows, the
 * cancel/edit-price panels). Before this existed each of them reached for `formatWeiMANA` + `Mana` +
 * `ManaToFiat` directly, which silently mislabels a `USD_PEGGED_MANA` listing: the amount is USD wei,
 * so it renders ~15x low and the fiat line compounds the error by applying the MANA rate on top.
 */
const ListingPrice = ({ price, network, tradeId, showFiat = false, size, className, manaClassName, inline, showTooltip }: Props) => {
  const isUSDPegged = useTradePriceDenomination(tradeId) === PriceDenomination.USD_PEGGED

  if (isUSDPegged) {
    return <CreditsPrice usdWei={price} size={size} showUsd={showFiat} className={className} />
  }

  return (
    <span className={className}>
      <Mana className={manaClassName} network={network} size={size} inline={inline} showTooltip={showTooltip}>
        {formatWeiMANA(price)}
      </Mana>
      {showFiat && (
        <>
          {' '}
          &nbsp;
          {'('}
          <ManaToFiat mana={price} />
          {')'}
        </>
      )}
    </span>
  )
}

export default React.memo(ListingPrice)
