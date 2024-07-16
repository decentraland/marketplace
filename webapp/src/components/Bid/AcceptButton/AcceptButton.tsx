import React, { useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Popup } from 'decentraland-ui'
import { isNFT } from '../../../modules/asset/utils'
import { isInsufficientMANA, checkFingerprint } from '../../../modules/bid/utils'
import { useFingerprint } from '../../../modules/nft/hooks'
import { isLandLocked } from '../../../modules/rental/utils'
import { LandLockedPopup } from '../../LandLockedPopup'
import { Props } from './AcceptButton.types'

const AcceptButton = (props: Props) => {
  const { asset, bid, onClick, rental, userAddress } = props

  const [fingerprint, isLoadingFingerprint] = useFingerprint(asset && isNFT(asset) ? asset : null)
  const [hasInsufficientMANA, setHasInsufficientMANA] = useState(false)
  const isCurrentlyLocked = rental && asset && isLandLocked(userAddress, rental, asset)

  useEffect(() => {
    isInsufficientMANA(bid)
      .then(setHasInsufficientMANA)
      .catch(error => console.error(`Could not get the MANA from bidder ${bid.bidder}`, error))
  }, [bid])

  const isValidFingerprint = checkFingerprint(bid, fingerprint)
  const assetOwner = !!asset && (isNFT(asset) ? asset.owner : asset?.creator)
  const isValidSeller = assetOwner && assetOwner === userAddress

  const isDisabled = isCurrentlyLocked || !asset || isLoadingFingerprint || hasInsufficientMANA || !isValidFingerprint || !isValidSeller

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
      <LandLockedPopup asset={asset} rental={rental} userAddress={userAddress}>
        {button}
      </LandLockedPopup>
    )
  }

  return <div className="AcceptButton">{button}</div>
}

export default React.memo(AcceptButton)
