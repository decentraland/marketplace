import React, { useCallback } from 'react'
import { Stats, Mana, Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { formatMANA } from '../../../lib/mana'
import { isOwnedBy } from '../../../modules/nft/utils'
import { getExpiresAt } from '../../../modules/order/utils'
import { locations } from '../../../modules/routing/locations'
import { Props } from './Order.types'
import './Order.css'

const Order = (props: Props) => {
  const { wallet, nft, order, onNavigate } = props

  const handleSell = useCallback(
    () => onNavigate(locations.sell(nft.contractAddress, nft.tokenId)),
    [nft, onNavigate]
  )
  const handleBuy = useCallback(
    () => onNavigate(locations.buy(nft.contractAddress, nft.tokenId)),
    [nft, onNavigate]
  )
  const handleBid = useCallback(
    () => onNavigate(locations.bid(nft.contractAddress, nft.tokenId)),
    [nft, onNavigate]
  )
  const handleCancel = useCallback(
    () => onNavigate(locations.cancel(nft.contractAddress, nft.tokenId)),
    [nft, onNavigate]
  )
  const handleTransfer = useCallback(
    () => onNavigate(locations.transfer(nft.contractAddress, nft.tokenId)),
    [nft, onNavigate]
  )

  const isOwner = isOwnedBy(nft, wallet)

  return (
    <div className="Order">
      <div className="left">
        {order ? (
          <>
            <Stats title={t('detail.price')}>
              <Mana>{formatMANA(order.price)}</Mana>
            </Stats>
            <Stats title={t('detail.expires')}>{getExpiresAt(order)}</Stats>
          </>
        ) : null}
      </div>
      <div className="right">
        {order ? (
          isOwner ? (
            <>
              <Button onClick={handleSell} primary>
                {t('detail.update')}
              </Button>
              <Button onClick={handleCancel}>{t('detail.cancel_sale')}</Button>
            </>
          ) : (
            <>
              <Button onClick={handleBuy} primary>
                {t('detail.buy')}
              </Button>
              <Button onClick={handleBid}>{t('detail.bid')}</Button>
            </>
          )
        ) : isOwner ? (
          <Button onClick={handleSell} primary>
            {t('detail.sell')}
          </Button>
        ) : (
          <Button primary onClick={handleBid}>
            {t('detail.bid')}
          </Button>
        )}
        {isOwner && !order ? (
          <Button onClick={handleTransfer}>{t('detail.transfer')}</Button>
        ) : null}
      </div>
    </div>
  )
}

export default React.memo(Order)
