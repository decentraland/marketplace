import React, { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { Contract, NFTCategory } from '@dcl/schemas'
import { withAuthorizedAction, ChainButton } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { toFixedMANAValue } from 'decentraland-dapps/dist/lib/mana'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { ContractName, getContract as getDecentralandContract } from 'decentraland-transactions'
import { Header, Form, Field, Button } from 'decentraland-ui'
import { parseMANANumber } from '../../../lib/mana'
import { getAssetName, isNFT, isOwnedBy } from '../../../modules/asset/utils'
import { getBidStatus, getError } from '../../../modules/bid/selectors'
import { useFingerprint } from '../../../modules/nft/hooks'
import { isLand } from '../../../modules/nft/utils'
import { getDefaultExpirationDate } from '../../../modules/order/utils'
import { getRentalEndDate, hasRentalEnded, isRentalListingExecuted } from '../../../modules/rental/utils'
import { locations } from '../../../modules/routing/locations'
import { getContractNames } from '../../../modules/vendor'
import { AssetAction } from '../../AssetAction'
import { ConfirmInputValueModal } from '../../ConfirmInputValueModal'
import ErrorBanner from '../../ErrorBanner'
import { Mana } from '../../Mana'
import { ManaField } from '../../ManaField'
import { Props } from './BidModal.types'
import './BidModal.css'

const BidModal = (props: Props) => {
  const { asset, rental, wallet, onNavigate, onPlaceBid, isPlacingBid, isLoadingAuthorization, isBidsOffchainEnabled, getContract } = props

  const [price, setPrice] = useState('')
  const [expiresAt, setExpiresAt] = useState(getDefaultExpirationDate())

  const [fingerprint, isLoadingFingerprint, contractFingerprint] = useFingerprint(isNFT(asset) ? asset : null)

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handlePlaceBid = useCallback(
    () => onPlaceBid(asset, parseMANANumber(price), +new Date(`${expiresAt} 00:00:00`), fingerprint),
    [asset, price, expiresAt, fingerprint, onPlaceBid]
  )

  const contractNames = getContractNames()

  const mana = getContract({
    name: contractNames.MANA,
    network: asset.network
  })

  const bids = getContract({
    name: contractNames.BIDS,
    network: asset.network
  })

  console.log('isBidsOffchainEnabled: ', isBidsOffchainEnabled);
  const offchainBidsContract = isBidsOffchainEnabled ? getDecentralandContract(ContractName.OffChainMarketplace, asset.chainId) : null

  if (!wallet || !mana || !bids) {
    return null
  }

  const handleSubmit = () => {
    setShowConfirmationModal(true)
  }

  const handleConfirmBid = () => {
    const { onAuthorizedAction, onClearBidError } = props
    onClearBidError()
    onAuthorizedAction({
      targetContractName: ContractName.MANAToken,
      authorizedAddress: isBidsOffchainEnabled && !!offchainBidsContract ? offchainBidsContract.address : bids.address,
      targetContract: mana as Contract,
      authorizationType: AuthorizationType.ALLOWANCE,
      authorizedContractLabel: isBidsOffchainEnabled && !!offchainBidsContract ? offchainBidsContract.name : bids.label || bids.name,
      requiredAllowanceInWei: ethers.utils.parseEther(price).toString(),
      onAuthorized: handlePlaceBid
    })
  }

  const isInvalidPrice = parseMANANumber(price) <= 0
  const isInvalidDate = +new Date(`${expiresAt} 00:00:00`) < Date.now()
  const hasInsufficientMANA = !!price && !!wallet && parseMANANumber(price) > wallet.networks[asset.network].mana

  const isDisabled =
    isOwnedBy(asset, wallet) ||
    isInvalidPrice ||
    isInvalidDate ||
    hasInsufficientMANA ||
    isLoadingFingerprint ||
    isPlacingBid ||
    (!fingerprint && asset.category === NFTCategory.ESTATE) ||
    contractFingerprint !== fingerprint

  return (
    <AssetAction asset={asset}>
      <div className="bid-action">
        <Header size="large">{t('bid_page.title')}</Header>
        <p className="subtitle">
          <T
            id="bid_page.subtitle"
            values={{
              name: <b className="primary-text">{getAssetName(asset)}</b>
            }}
          />
        </p>
        {isLand(asset) && rental && isRentalListingExecuted(rental) && !hasRentalEnded(rental) ? (
          <div className="rentalMessage">
            <T
              id="bid_page.rental_executed"
              values={{
                rental_end_date: getRentalEndDate(rental),
                asset_type: asset.category,
                strong: (children: any) => <strong>{children}</strong>
              }}
            />
          </div>
        ) : null}
        <Form onSubmit={handleSubmit}>
          <div className="form-fields">
            <ManaField
              network={asset.network}
              label={t('bid_page.price')}
              placeholder={1000}
              value={price}
              error={price !== '' && (isInvalidPrice || hasInsufficientMANA)}
              onChange={(_event, props) => {
                setPrice(toFixedMANAValue(props.value))
              }}
              message={hasInsufficientMANA ? t('bid_page.not_enougn_mana') : undefined}
            />
            <Field
              network={asset.network}
              label={t('bid_page.expiration_date')}
              type="date"
              value={expiresAt}
              onChange={(_event, props) => setExpiresAt(props.value || getDefaultExpirationDate())}
              error={isInvalidDate}
              message={isInvalidDate ? t('bid_page.invalid_date') : undefined}
            />
            {!isLoadingFingerprint && contractFingerprint !== fingerprint ? (
              <ErrorBanner info={t('atlas_updated_warning.fingerprint_missmatch')} />
            ) : null}
          </div>
          <div className="buttons">
            <Button
              as="div"
              disabled={isLoadingFingerprint || isPlacingBid}
              onClick={() =>
                onNavigate(
                  isNFT(asset) ? locations.nft(asset.contractAddress, asset.tokenId) : locations.item(asset.contractAddress, asset.itemId)
                )
              }
            >
              {t('global.cancel')}
            </Button>
            <ChainButton type="submit" primary loading={isPlacingBid} disabled={isDisabled} chainId={asset.chainId}>
              {t('bid_page.submit')}
            </ChainButton>
          </div>
        </Form>
        {showConfirmationModal ? (
          <ConfirmInputValueModal
            open={showConfirmationModal}
            headerTitle={t('bid_page.confirm.title')}
            content={
              <>
                <T
                  id="bid_page.confirm.create_bid_line_one"
                  values={{
                    name: <b>{getAssetName(asset)}</b>,
                    amount: (
                      <Mana showTooltip network={asset.network} inline>
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
            network={asset.network}
            onCancel={() => setShowConfirmationModal(false)}
            loading={isPlacingBid || isLoadingAuthorization}
            disabled={isPlacingBid || isLoadingAuthorization}
          />
        ) : null}
      </div>
    </AssetAction>
  )
}

export default React.memo(
  withAuthorizedAction(
    BidModal,
    AuthorizedAction.BID,
    {
      action: 'bid_page.authorization.action',
      title_action: 'bid_page.authorization.title_action'
    },
    getBidStatus,
    getError
  )
)
