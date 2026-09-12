import React, { useState, useCallback, useMemo } from 'react'
import { ethers } from 'ethers'
import { ChainId, Contract } from '@dcl/schemas'
import { withAuthorizedAction, ChainButton } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { toFixedMANAValue } from 'decentraland-dapps/dist/lib/mana'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { ContractName } from 'decentraland-transactions'
import { Header, Form, Field, Button } from 'decentraland-ui'
import { parseMANANumber } from '../../../lib/mana'
import { getAssetName, isNFT, isOwnedBy } from '../../../modules/asset/utils'
import { getBidStatus, getError } from '../../../modules/bid/selectors'
import { applyEstateSnapshot } from '../../../modules/nft/estate/utils'
import { isEstateSnapshotBlocking, useEstateSnapshot } from '../../../modules/nft/hooks'
import { isLand } from '../../../modules/nft/utils'
import { getDefaultExpirationDate } from '../../../modules/order/utils'
import { getRentalEndDate, hasRentalEnded, isRentalListingExecuted } from '../../../modules/rental/utils'
import { locations } from '../../../modules/routing/locations'
import { getContractNames } from '../../../modules/vendor'
import { getLatestOffChainMarketplaceContract } from '../../../utils/trades'
import { AssetAction } from '../../AssetAction'
import { isPriceTooLow } from '../../BuyPage/utils'
import { ConfirmInputValueModal } from '../../ConfirmInputValueModal'
import { EstateCompositionWarning } from '../../EstateCompositionWarning'
import { Mana } from '../../Mana'
import { ManaField } from '../../ManaField'
import { Props } from './BidModal.types'
import './BidModal.css'

const BidModal = (props: Props) => {
  const { asset, rental, wallet, onNavigate, onPlaceBid, isPlacingBid, isLoadingAuthorization, authorizationError, getContract } = props

  const [price, setPrice] = useState('')
  const [expiresAt, setExpiresAt] = useState(getDefaultExpirationDate())

  // The bid records which LANDs the Estate contains, so it is placed against the
  // composition read when this form opened — the one shown alongside it — and not
  // against whatever the registry holds by the time the bid is signed.
  const estateComposition = useEstateSnapshot(isNFT(asset) ? asset : null)
  // Draw the Estate from the registry rather than from the indexed copy, so what is on screen is the
  // composition the signature will be bound to even while the indexer is behind.
  const displayedAsset = estateComposition.snapshot && isNFT(asset) ? applyEstateSnapshot(asset, estateComposition.snapshot) : asset
  const isEstateBlocked = isEstateSnapshotBlocking(estateComposition)

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [estateCompositionError, setEstateCompositionError] = useState<string>()

  const handlePlaceBid = useCallback(() => {
    void (async () => {
      if (!(await estateComposition.confirm())) {
        setEstateCompositionError(t('estate_composition.changed'))
        return
      }
      onPlaceBid(asset, parseMANANumber(price), +new Date(`${expiresAt} 00:00:00`), estateComposition.fingerprint)
    })()
  }, [asset, price, expiresAt, estateComposition, onPlaceBid])

  const contractNames = getContractNames()

  const mana = getContract({
    name: contractNames.MANA,
    network: asset.network
  })

  const bids = getContract({
    name: contractNames.BIDS,
    network: asset.network
  })

  const offchainBidsContract = getLatestOffChainMarketplaceContract(asset.chainId)

  if (!wallet || !mana || !bids) {
    return null
  }

  const handleSubmit = () => {
    setShowConfirmationModal(true)
  }

  const handleConfirmBid = () => {
    const { onAuthorizedAction, onClearBidError } = props

    onClearBidError()
    setEstateCompositionError(undefined)
    onAuthorizedAction({
      targetContractName: ContractName.MANAToken,
      authorizedAddress: offchainBidsContract?.address ?? bids.address,
      targetContract: mana as Contract,
      authorizationType: AuthorizationType.ALLOWANCE,
      authorizedContractLabel: offchainBidsContract?.name ?? (bids.label || bids.name),
      requiredAllowanceInWei: ethers.utils.parseEther(price).toString(),
      onAuthorized: handlePlaceBid
    })
  }

  const isInvalidPrice = parseMANANumber(price) <= 0
  const isInvalidDate = +new Date(`${expiresAt} 00:00:00`) < Date.now()
  const hasInsufficientMANA = !!price && !!wallet && parseMANANumber(price) > wallet.networks[asset.network].mana

  // Compute if the price is too low for meta tx
  const hasLowPriceForMetaTx = useMemo(
    () =>
      (wallet?.chainId as ChainId) !== ChainId.MATIC_MAINNET && !!price && isPriceTooLow(ethers.utils.parseEther(price || '0').toString()), // not connected to polygon AND has price < minimum for meta tx
    [price, wallet?.chainId]
  )

  const isDisabled =
    isOwnedBy(asset, wallet) ||
    isInvalidPrice ||
    isInvalidDate ||
    hasInsufficientMANA ||
    isPlacingBid ||
    hasLowPriceForMetaTx ||
    isEstateBlocked

  return (
    <AssetAction asset={displayedAsset}>
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
            <EstateCompositionWarning state={estateComposition} />
          </div>
          {hasLowPriceForMetaTx ? (
            <span className="warning">
              {' '}
              {t('buy_with_crypto_modal.price_too_low', {
                learn_more: (
                  <a
                    href="https://docs.decentraland.org/blockchain-integration/transactions-in-polygon#why-do-i-have-to-cover-the-transaction-fees-for-items-that-cost-less-than-1-mana"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* TODO: add this URL */}
                    <u> {t('buy_with_crypto_modal.learn_more')} </u>
                  </a>
                )
              })}
            </span>
          ) : (
            <span className="rememberFreeTxs">
              {t('buy_with_crypto_modal.remember_transaction_fee_covered', {
                covered: <span className="feeCoveredFree">{t('buy_with_crypto_modal.covered_for_you_by_dao')}</span>
              })}
            </span>
          )}
          <div className="buttons">
            <Button
              as="div"
              disabled={isPlacingBid}
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
            error={estateCompositionError || authorizationError}
            onCancel={() => setShowConfirmationModal(false)}
            loading={isPlacingBid || isLoadingAuthorization}
            disabled={isPlacingBid || isLoadingAuthorization}
          />
        ) : null}
      </div>
    </AssetAction>
  )
}

export const LegacyBidModal = React.memo(
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

export default React.memo(
  withAuthorizedAction(
    BidModal,
    AuthorizedAction.BID,
    {
      action: 'bid_page.authorization.action',
      title_action: 'bid_page.authorization.title_action',
      confirm_transaction: {
        title: 'bid_page.authorization.confirm_transaction_title',
        action: 'bid_page.authorization.confirm_transaction_action'
      }
    },
    getBidStatus,
    getError
  )
)
