import React, { useCallback } from 'react'
import { Stats, Mana, Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { formatPrice } from '../../../modules/order/utils'
import { isOwnedBy } from '../../../modules/nft/utils'
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
  const handleCancel = useCallback(
    () => onNavigate(locations.cancel(nft.contractAddress, nft.tokenId)),
    [nft, onNavigate]
  )
  const handleTransfer = useCallback(
    () => onNavigate(locations.transfer(nft.contractAddress, nft.tokenId)),
    [nft, onNavigate]
  )

  const isOwner = isOwnedBy(nft, wallet)

  // Nothing to show
  const isHidden = !order && !isOwner
  if (isHidden) return null

  return (
    <div className="Order">
      <div className="left">
        {order ? (
          <>
            <Stats title={t('detail.price')}>
              <Mana>{formatPrice(order.price)}</Mana>
            </Stats>
            <Stats title={t('detail.expires')}>
              {formatDistanceToNow(+order.expiresAt)}
            </Stats>
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
            <Button onClick={handleBuy} primary>
              {t('detail.buy')}
            </Button>
          )
        ) : isOwner ? (
          <Button onClick={handleSell} primary>
            {t('detail.sell')}
          </Button>
        ) : null}
        {isOwner && !order ? (
          <Button onClick={handleTransfer}>{t('detail.transfer')}</Button>
        ) : null}
      </div>
    </div>
  )
}

export default React.memo(Order)
