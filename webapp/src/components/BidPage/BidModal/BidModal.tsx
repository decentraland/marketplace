import React, { useState, useCallback } from 'react'
import { Header, Field, Button } from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { MANA_SYMBOL, toMANA, fromMANA } from '../../../lib/mana'
import { NFTAction } from '../../NFTAction'
import { getNFTName, isOwnedBy } from '../../../modules/nft/utils'
import { getDefaultExpirationDate } from '../../../modules/order/utils'
import { locations } from '../../../modules/routing/locations'
import { hasAuthorization } from '../../../modules/authorization/utils'
import { contractAddresses } from '../../../modules/contract/utils'
import { useFingerprint } from '../../../modules/nft/hooks'
import { AuthorizationType } from '../../AuthorizationModal/AuthorizationModal.types'
import { AuthorizationModal } from '../../AuthorizationModal'
import { Props } from './BidModal.types'
import './BidModal.css'

const BidModal = (props: Props) => {
  const { nft, wallet, onNavigate, onPlaceBid } = props

  const [price, setPrice] = useState('')
  const [expiresAt, setExpiresAt] = useState(getDefaultExpirationDate())

  const [fingerprint, isLoading] = useFingerprint(nft)

  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)

  const handlePlaceBid = useCallback(
    () => onPlaceBid(nft, fromMANA(price), +new Date(expiresAt), fingerprint),
    [nft, price, expiresAt, fingerprint, onPlaceBid]
  )

  const handleSubmit = useCallback(() => {
    if (
      hasAuthorization(
        contractAddresses.Bids,
        contractAddresses.MANAToken,
        AuthorizationType.ALLOWANCE
      )
    ) {
      handlePlaceBid()
    } else {
      setShowAuthorizationModal(true)
    }
  }, [handlePlaceBid, setShowAuthorizationModal])

  const handleClose = useCallback(() => setShowAuthorizationModal(false), [
    setShowAuthorizationModal
  ])

  const isInvalidDate = +new Date(expiresAt) < Date.now()
  const notEnoughMana = !!price && !!wallet && fromMANA(price) > wallet.mana

  return (
    <NFTAction nft={nft}>
      <Header size="large">{t('bid_page.title')}</Header>
      <p className="subtitle">
        <T
          id={'bid_page.subtitle'}
          values={{
            name: <b className="primary-text">{getNFTName(nft)}</b>
          }}
        />
      </p>
      <div className="fields">
        <Field
          label={t('bid_page.price')}
          placeholder={MANA_SYMBOL + ' ' + (1000).toLocaleString()}
          value={price}
          onChange={(_event, props) => {
            const newPrice = fromMANA(props.value)
            setPrice(toMANA(newPrice))
          }}
          error={notEnoughMana}
          message={notEnoughMana ? t('bid_page.not_enougn_mana') : undefined}
        />
        <Field
          label={t('bid_page.expiration_date')}
          type="date"
          value={expiresAt}
          onChange={(_event, props) =>
            setExpiresAt(props.value || getDefaultExpirationDate())
          }
          error={isInvalidDate}
          message={isInvalidDate ? t('bid_page.invalid_date') : undefined}
        />
      </div>
      <div className="buttons">
        <Button
          onClick={() =>
            onNavigate(locations.ntf(nft.contractAddress, nft.tokenId))
          }
        >
          {t('global.cancel')}
        </Button>
        <Button
          primary
          disabled={
            isOwnedBy(nft, wallet) ||
            fromMANA(price) <= 0 ||
            isInvalidDate ||
            notEnoughMana ||
            isLoading
          }
          onClick={handleSubmit}
        >
          {t('bid_page.submit')}
        </Button>
      </div>
      <AuthorizationModal
        open={showAuthorizationModal}
        contractAddress={contractAddresses.Bids}
        tokenAddress={contractAddresses.MANAToken}
        type={AuthorizationType.ALLOWANCE}
        onProceed={handlePlaceBid}
        onCancel={handleClose}
      />
    </NFTAction>
  )
}

export default React.memo(BidModal)
