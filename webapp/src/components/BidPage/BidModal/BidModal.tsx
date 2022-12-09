import React, { useState, useCallback } from 'react'
import { Header, Form, Field, Button } from 'decentraland-ui'
import { ContractName } from 'decentraland-transactions'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { toFixedMANAValue } from 'decentraland-dapps/dist/lib/mana'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { ChainButton } from 'decentraland-dapps/dist/containers'
import {
  getRentalEndDate,
  hasRentalEnded,
  isRentalListingExecuted
} from '../../../modules/rental/utils'
import { getAssetName, isOwnedBy } from '../../../modules/asset/utils'
import { parseMANANumber } from '../../../lib/mana'
import { AssetAction } from '../../AssetAction'
import { getDefaultExpirationDate } from '../../../modules/order/utils'
import { locations } from '../../../modules/routing/locations'
import { useFingerprint } from '../../../modules/nft/hooks'
import { AuthorizationModal } from '../../AuthorizationModal'
import { getContractNames } from '../../../modules/vendor'
import { isLand } from '../../../modules/nft/utils'
import { ManaField } from '../../ManaField'
import { ConfirmInputValueModal } from '../../ConfirmInputValueModal'
import { Mana } from '../../Mana'
import { Props } from './BidModal.types'
import './BidModal.css'

const BidModal = (props: Props) => {
  const {
    nft,
    rental,
    wallet,
    authorizations,
    onNavigate,
    onPlaceBid,
    isPlacingBid,
    getContract
  } = props

  const [price, setPrice] = useState('')
  const [expiresAt, setExpiresAt] = useState(getDefaultExpirationDate())

  const [fingerprint, isLoading] = useFingerprint(nft)

  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handlePlaceBid = useCallback(
    () =>
      onPlaceBid(
        nft,
        parseMANANumber(price),
        +new Date(expiresAt),
        fingerprint
      ),
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

  if (!mana || !bids) {
    return null
  }

  const authorization: Authorization = {
    address: wallet.address,
    authorizedAddress: bids.address,
    contractAddress: mana.address,
    contractName: ContractName.MANAToken,
    chainId: mana.chainId,
    type: AuthorizationType.ALLOWANCE
  }

  const handleSubmit = () => {
    setShowConfirmationModal(true)
  }

  const handleConfirmBid = () => {
    if (hasAuthorization(authorizations, authorization)) {
      handlePlaceBid()
    } else {
      setShowAuthorizationModal(true)
    }
  }

  const handleClose = () => setShowAuthorizationModal(false)

  const isInvalidPrice = parseMANANumber(price) <= 0
  const isInvalidDate = +new Date(expiresAt) < Date.now()
  const hasInsufficientMANA =
    !!price &&
    !!wallet &&
    parseMANANumber(price) > wallet.networks[nft.network].mana

  const isDisabled =
    isOwnedBy(nft, wallet) ||
    isInvalidPrice ||
    isInvalidDate ||
    hasInsufficientMANA ||
    isLoading ||
    isPlacingBid

  return (
    <AssetAction asset={nft}>
      <div className="bid-action">
        <Header size="large">{t('bid_page.title')}</Header>
        <p className="subtitle">
          <T
            id="bid_page.subtitle"
            values={{
              name: <b className="primary-text">{getAssetName(nft)}</b>
            }}
          />
        </p>
        {isLand(nft) &&
        rental &&
        isRentalListingExecuted(rental) &&
        !hasRentalEnded(rental) ? (
          <div className="rentalMessage">
            <T
              id="bid_page.rental_executed"
              values={{
                rental_end_date: getRentalEndDate(rental),
                asset_type: nft.category,
                strong: (children: any) => <strong>{children}</strong>
              }}
            />
          </div>
        ) : null}
        <Form onSubmit={handleSubmit}>
          <div className="form-fields">
            <ManaField
              network={nft.network}
              label={t('bid_page.price')}
              placeholder={1000}
              value={price}
              error={price !== '' && (isInvalidPrice || hasInsufficientMANA)}
              onChange={(_event, props) => {
                setPrice(toFixedMANAValue(props.value))
              }}
              message={
                hasInsufficientMANA ? t('bid_page.not_enougn_mana') : undefined
              }
            />
            <Field
              network={nft.network}
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
              disabled={isLoading || isPlacingBid}
              onClick={() =>
                onNavigate(locations.nft(nft.contractAddress, nft.tokenId))
              }
            >
              {t('global.cancel')}
            </Button>
            <ChainButton
              type="submit"
              primary
              loading={isPlacingBid}
              disabled={isDisabled}
              chainId={nft.chainId}
            >
              {t('bid_page.submit')}
            </ChainButton>
          </div>
        </Form>
        <AuthorizationModal
          open={showAuthorizationModal}
          authorization={authorization}
          isLoading={isPlacingBid}
          onProceed={handlePlaceBid}
          onCancel={handleClose}
        />
        {showConfirmationModal ? (
          <ConfirmInputValueModal
            open={showConfirmationModal}
            headerTitle={t('bid_page.confirm.title')}
            content={
              <>
                <T
                  id="bid_page.confirm.create_bid_line_one"
                  values={{
                    name: <b>{getAssetName(nft)}</b>,
                    amount: (
                      <Mana network={nft.network} inline>
                        {parseMANANumber(price).toLocaleString()}
                      </Mana>
                    )
                  }}
                />
                <br />
                <T id="bid_page.confirm.accept_bid_line_two" />
              </>
            }
            onConfirm={handleConfirmBid}
            valueToConfirm={price}
            network={nft.network}
            onCancel={() => setShowConfirmationModal(false)}
            loading={isPlacingBid}
            disabled={isPlacingBid}
          />
        ) : null}
      </div>
    </AssetAction>
  )
}

export default React.memo(BidModal)
