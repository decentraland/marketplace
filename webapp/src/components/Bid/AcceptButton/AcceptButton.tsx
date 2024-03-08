import React, { useEffect, useState } from 'react'
import { Button, Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { useFingerprint } from '../../../modules/nft/hooks'
import { isInsufficientMANA, checkFingerprint } from '../../../modules/bid/utils'
import { isLandLocked } from '../../../modules/rental/utils'
import { LandLockedPopup } from '../../LandLockedPopup'
import { Props } from './AcceptButton.types'

const AcceptButton = (props: Props) => {
  const { nft, bid, onClick, rental, userAddress } = props

  const [fingerprint, isLoadingFingerprint] = useFingerprint(nft)
  const [hasInsufficientMANA, setHasInsufficientMANA] = useState(false)
  const isCurrentlyLocked = rental && nft && isLandLocked(userAddress, rental, nft)

  useEffect(() => {
    isInsufficientMANA(bid)
      .then(setHasInsufficientMANA)
      .catch(error => console.error(`Could not get the MANA from bidder ${bid.bidder}`, error))
  }, [bid])

  const isValidFingerprint = checkFingerprint(bid, fingerprint)
  const isValidSeller = !!nft && nft.owner === bid.seller

  const isDisabled = isCurrentlyLocked || !nft || isLoadingFingerprint || hasInsufficientMANA || !isValidFingerprint || !isValidSeller

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
    button = <Popup content={t('bid.invalid_seller')} position="top center" trigger={<div className="popup-button">{button}</div>} />
  } else if (isCurrentlyLocked) {
    button = (
      <LandLockedPopup asset={nft} rental={rental} userAddress={userAddress}>
        {button}
      </LandLockedPopup>
    )
  }

  return <div className="AcceptButton">{button}</div>
}

export default React.memo(AcceptButton)
