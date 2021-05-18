import React, { useState, useCallback } from 'react'
import { Network } from '@dcl/schemas'
import { Header, Form, Field, Button } from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { toMANA, fromMANA } from '../../../lib/mana'
import { NFTAction } from '../../NFTAction'
import { getNFTName, isOwnedBy } from '../../../modules/nft/utils'
import { getDefaultExpirationDate } from '../../../modules/order/utils'
import { locations } from '../../../modules/routing/locations'
import { useFingerprint } from '../../../modules/nft/hooks'
import { AuthorizationModal } from '../../AuthorizationModal'
import { Props } from './BidModal.types'
import './BidModal.css'
import { getContractNames } from '../../../modules/vendor'
import { getContract } from '../../../modules/contract/utils'
import { ContractName } from 'decentraland-transactions'

const BidModal = (props: Props) => {
  const { nft, wallet, authorizations, onNavigate, onPlaceBid } = props

  const [price, setPrice] = useState('')
  const [expiresAt, setExpiresAt] = useState(getDefaultExpirationDate())

  const [fingerprint, isLoading] = useFingerprint(nft)

  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)

  const handlePlaceBid = useCallback(
    () => onPlaceBid(nft, fromMANA(price), +new Date(expiresAt), fingerprint),
    [nft, price, expiresAt, fingerprint, onPlaceBid]
  )

  if (!wallet) {
    return null
  }

  const contractNames = getContractNames()

  const mana = getContract({
    name: contractNames.MANA,
    network: nft.network
  })

  const bids = getContract({
    name: contractNames.BIDS,
    network: nft.network
  })

  const authorization: Authorization = {
    address: wallet.address,
    authorizedAddress: bids.address,
    contractAddress: mana.address,
    contractName: ContractName.MANAToken,
    chainId: nft.chainId,
    type: AuthorizationType.ALLOWANCE
  }

  const handleSubmit = () => {
    if (hasAuthorization(authorizations, authorization)) {
      handlePlaceBid()
    } else {
      setShowAuthorizationModal(true)
    }
  }

  const handleClose = () => setShowAuthorizationModal(false)

  const isInvalidDate = +new Date(expiresAt) < Date.now()
  const notEnoughMana =
    !!price &&
    !!wallet &&
    fromMANA(price) > wallet.networks[Network.ETHEREUM].mana

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
      <Form onSubmit={handleSubmit}>
        <div className="form-fields">
          <Field
            label={t('bid_page.price')}
            placeholder={toMANA(1000)}
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
            as="div"
            onClick={() =>
              onNavigate(locations.nft(nft.contractAddress, nft.tokenId))
            }
          >
            {t('global.cancel')}
          </Button>
          <Button
            type="submit"
            primary
            disabled={
              isOwnedBy(nft, wallet) ||
              fromMANA(price) <= 0 ||
              isInvalidDate ||
              notEnoughMana ||
              isLoading
            }
          >
            {t('bid_page.submit')}
          </Button>
        </div>
      </Form>
      <AuthorizationModal
        open={showAuthorizationModal}
        authorization={authorization}
        onProceed={handlePlaceBid}
        onCancel={handleClose}
      />
    </NFTAction>
  )
}

export default React.memo(BidModal)
