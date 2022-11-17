import React, { useEffect, useState } from 'react'
import { Button, Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { useFingerprint } from '../../../modules/nft/hooks'
import {
  isInsufficientMANA,
  checkFingerprint
} from '../../../modules/bid/utils'
import { isRentalListingExecuted } from '../../../modules/rental/utils'
import { Props } from './AcceptButton.types'

const AcceptButton = (props: Props) => {
  const { nft, bid, onClick, rental } = props

  const [fingerprint, isLoadingFingerprint] = useFingerprint(nft)
  const [hasInsufficientMANA, setHasInsufficientMANA] = useState(false)
  const isCurrentlyRented = isRentalListingExecuted(rental)

  useEffect(() => {
    isInsufficientMANA(bid)
      .then(setHasInsufficientMANA)
      .catch(error =>
        console.error(`Could not get the MANA from bidder ${bid.bidder}`, error)
      )
  }, [bid])

  const isValidFingerprint = checkFingerprint(bid, fingerprint)
  const isValidSeller = !!nft && nft.owner === bid.seller

  const isDisabled =
    isCurrentlyRented ||
    !nft ||
    isLoadingFingerprint ||
    hasInsufficientMANA ||
    !isValidFingerprint ||
    !isValidSeller

  let button = (
    <Button primary disabled={isDisabled} onClick={onClick}>
      {t('global.accept')}
    </Button>
  )

  if (hasInsufficientMANA) {
    button = (
      <Popup
        content={t('bid.not_enough_mana_on_bid_received')}
        position="top center"
        trigger={<div className="popup-button">{button}</div>}
      />
    )
  } else if (!isValidFingerprint) {
    button = (
      <Popup
        content={t('bid.invalid_fingerprint_on_bid_received')}
        position="top center"
        trigger={<div className="popup-button">{button}</div>}
      />
    )
  } else if (!isValidSeller) {
    button = (
      <Popup
        content={t('bid.invalid_seller')}
        position="top center"
        trigger={<div className="popup-button">{button}</div>}
      />
    )
  } else if (isCurrentlyRented) {
    button = (
      <Popup
        content={t('bid.cant_accept_bid_on_rented_land')}
        position="top center"
        trigger={<div className="popup-button">{button}</div>}
      />
    )
  }

  return <div className="AcceptButton">{button}</div>
}

export default React.memo(AcceptButton)
