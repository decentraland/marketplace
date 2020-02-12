import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader, Stats, Mana, Button, Popup } from 'decentraland-ui'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { locations } from '../../modules/routing/locations'
import { addressEquals } from '../../modules/wallet/utils'
import { NFTProvider } from '../NFTProvider'
import { NFTImage } from '../NFTImage'
import { Address } from '../Address'
import { formatMANA } from '../../lib/mana'
import { Props } from './Bid.types'
import './Bid.css'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isInsufficientMANA } from '../../modules/bid/utils'

const Bid = (props: Props) => {
  const {
    bid,
    wallet,
    archivedBidIds,
    onAccept,
    onArchive,
    onUnarchive,
    onCancel,
    onUpdate,
    isArchivable,
    hasImage
  } = props

  const isArchived = archivedBidIds.includes(bid.id)
  const isBidder = !!wallet && addressEquals(wallet.address, bid.bidder)
  const isSeller = !!wallet && addressEquals(wallet.address, bid.seller)

  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    if (isSeller) {
      isInsufficientMANA(bid).then(setIsDisabled)
    }
  }, [bid, isSeller])

  let acceptButton = (
    <Button primary disabled={isDisabled} onClick={() => onAccept(bid)}>
      {t('global.accept')}
    </Button>
  )

  if (isDisabled) {
    acceptButton = (
      <Popup
        content={t('bid.not_enough_mana')}
        position="top center"
        trigger={<div className="not-enough-mana">{acceptButton}</div>}
      />
    )
  }

  return (
    <div className="Bid">
      {hasImage ? (
        <div className="image">
          <NFTProvider
            contractAddress={bid.contractAddress}
            tokenId={bid.tokenId}
          >
            {(nft, isLoading) => (
              <>
                {!nft && isLoading ? <Loader active /> : null}
                {nft ? (
                  <Link to={locations.ntf(bid.contractAddress, bid.tokenId)}>
                    <NFTImage nft={nft} />{' '}
                  </Link>
                ) : null}
              </>
            )}
          </NFTProvider>
        </div>
      ) : null}
      <div className="wrapper">
        <div className="info">
          {!isBidder ? (
            <Stats className="from" title="from">
              <Address address={bid.bidder} />
            </Stats>
          ) : null}
          <Stats title="price">
            <Mana>{formatMANA(bid.price)}</Mana>
          </Stats>
          <Stats title="time left">{formatDistanceToNow(+bid.expiresAt)}</Stats>
        </div>
        {isBidder || isSeller ? (
          <div className="actions">
            {isBidder ? (
              <>
                <Button primary onClick={() => onUpdate(bid)}>
                  {t('global.update')}
                </Button>
                <Button onClick={() => onCancel(bid)}>
                  {t('global.cancel')}
                </Button>
              </>
            ) : null}
            {isSeller ? (
              <>
                {acceptButton}
                {isArchivable ? (
                  !isArchived ? (
                    <Button onClick={() => onArchive(bid)}>
                      {t('my_bids_page.archive')}
                    </Button>
                  ) : (
                    <Button onClick={() => onUnarchive(bid)}>
                      {t('my_bids_page.unarchive')}
                    </Button>
                  )
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

Bid.defaultProps = {
  isArchivable: true,
  hasImage: true
}

export default React.memo(Bid)
