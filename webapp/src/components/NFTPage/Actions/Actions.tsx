import React, { useCallback } from 'react'
import { Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { isOwnedBy } from '../../../modules/nft/utils'
import { locations } from '../../../modules/routing/locations'
import { VendorFactory } from '../../../modules/vendor'
import { Props } from './Actions.types'
import './Actions.css'

const Actions = (props: Props) => {
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
  const hasBids = VendorFactory.build(nft.vendor).hasBids()

  return (
    <>
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
            {hasBids ? (
              <Button onClick={handleBid}>{t('detail.bid')}</Button>
            ) : null}
          </>
        )
      ) : isOwner ? (
        <Button onClick={handleSell} primary>
          {t('detail.sell')}
        </Button>
      ) : hasBids ? (
        <Button primary onClick={handleBid}>
          {t('detail.bid')}
        </Button>
      ) : null}
      {isOwner && !order ? (
        <Button onClick={handleTransfer}>{t('detail.transfer')}</Button>
      ) : null}
    </>
  )
}

export default React.memo(Actions)
