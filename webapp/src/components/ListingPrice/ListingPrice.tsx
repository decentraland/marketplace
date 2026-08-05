import React from 'react'
import { Mana } from 'decentraland-ui'
import { formatWeiMANA } from '../../lib/mana'
import { PriceDenomination } from '../../modules/trade/denomination'
import { useTradePriceDenomination } from '../../modules/trade/hooks'
import { ManaToFiat } from '../ManaToFiat'
import { PeggedManaPrice } from '../PeggedManaPrice'
import { Props } from './ListingPrice.types'

/**
 * One listing price, in whichever unit its trade actually denominates it.
 *
 * The single funnel for the row/list surfaces (listing tables, on-sale lists, collection rows, the
 * cancel/edit-price panels). Before this existed each of them reached for `formatWeiMANA` + `Mana` +
 * `ManaToFiat` directly, which silently mislabels a `USD_PEGGED_MANA` listing: the amount is USD wei,
 * so it renders ~15x low and the fiat line compounds the error by applying the MANA rate on top.
 *
 * Both branches end up in MANA, which is the only currency this app charges in — a pegged listing just has to
 * be converted through the settlement oracle first, and is marked approximate because that rate moves.
 */
const ListingPrice = ({ price, network, tradeId, showFiat = false, size, className, manaClassName, inline, showTooltip }: Props) => {
  const isUSDPegged = useTradePriceDenomination(tradeId) === PriceDenomination.USD_PEGGED

  if (isUSDPegged) {
    // No fiat parenthetical here even when `showFiat` is set: the USD figure is what the listing is pegged TO,
    // not what the buyer pays, and showing both invites reading the wrong one as the price.
    return (
      <PeggedManaPrice usdWei={price} network={network} size={size} className={className} manaClassName={manaClassName} inline={inline} />
    )
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
