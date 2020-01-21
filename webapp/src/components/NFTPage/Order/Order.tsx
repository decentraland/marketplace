import React, { useCallback } from 'react'
import { Stats, Mana, Button } from 'decentraland-ui'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { formatPrice } from '../../../modules/order/utils'
import { locations } from '../../../modules/routing/locations'
import { Props } from './Order.types'

import './Order.css'

const Order = (props: Props) => {
  const { address, nft, order, onNavigate } = props

  const handleSell = useCallback(
    () => onNavigate(locations.sell(nft.contractAddress, nft.tokenId)),
    []
  )
  const handleBuy = useCallback(
    () => onNavigate(locations.buy(nft.contractAddress, nft.tokenId)),
    []
  )
  const handleCancel = useCallback(
    () => onNavigate(locations.cancel(nft.contractAddress, nft.tokenId)),
    []
  )
  const handleTransfer = useCallback(
    () => onNavigate(locations.cancel(nft.contractAddress, nft.tokenId)),
    []
  )

  const isOwner =
    !!address && nft.owner.id.toLowerCase() === address.toLowerCase()

  // nothing to show
  const isHidden = !order && !isOwner
  if (isHidden) return null

  return (
    <div className="Order">
      <div className="left">
        {order ? (
          <>
            <Stats title="Price">
              <Mana>{formatPrice(order.price)}</Mana>
            </Stats>
            <Stats title="Expires in">
              {formatDistanceToNow(+order.expiresAt)}
            </Stats>
          </>
        ) : null}
      </div>
      <div className="right">
        {order ? (
          isOwner ? (
            <Button onClick={handleCancel} primary>
              Cancel Sale
            </Button>
          ) : (
            <Button onClick={handleBuy} primary>
              Buy
            </Button>
          )
        ) : isOwner ? (
          <Button onClick={handleSell} primary>
            Sell
          </Button>
        ) : null}
        {isOwner ? <Button onClick={handleTransfer}>Transfer</Button> : null}
      </div>
    </div>
  )
}

export default React.memo(Order)
