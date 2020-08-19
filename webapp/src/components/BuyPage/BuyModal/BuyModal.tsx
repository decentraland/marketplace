import React, { useState, useCallback } from 'react'
import { Header, Mana, Button } from 'decentraland-ui'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatMANA } from '../../../lib/mana'
import { locations } from '../../../modules/routing/locations'
import { isPartner } from '../../../modules/vendor/utils'
import { getNFTName } from '../../../modules/nft/utils'
import { hasAuthorization } from '../../../modules/authorization/utils'
import { contractAddresses } from '../../../modules/contract/utils'
import { useFingerprint, useComputedPrice } from '../../../modules/nft/hooks'
import { NFTCategory } from '../../../modules/nft/types'
import { NFTAction } from '../../NFTAction'
import { AuthorizationModal } from '../../AuthorizationModal'
import { AuthorizationType } from '../../AuthorizationModal/AuthorizationModal.types'
import { Props } from './BuyModal.types'

const BuyPage = (props: Props) => {
  const {
    nft,
    order,
    authorizations,
    isLoading,
    onNavigate,
    onExecuteOrder,
    isOwner,
    notEnoughMana
  } = props

  const [fingerprint, isFingerprintLoading] = useFingerprint(nft)
  const [
    computedPrice,
    percentageIncrease,
    isAboveMaxPercentage
  ] = useComputedPrice(nft, order)
  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)
  const [wantsToProceed, setWantsToProceed] = useState(false)

  const handleExecuteOrder = useCallback(() => {
    onExecuteOrder(order!, nft, fingerprint)
  }, [order, nft, fingerprint, onExecuteOrder])

  // TODO: VendorFactory.build().nftService.getMarketpaceAddress() ??
  const marketplaceAddress = isPartner(nft.vendor)
    ? contractAddresses.MarketplaceAdapter
    : contractAddresses.Marketplace

  const handleToggleWantsToProceed = useCallback(() => {
    setWantsToProceed(!wantsToProceed)
  }, [wantsToProceed, setWantsToProceed])

  const handleSubmit = useCallback(() => {
    if (
      hasAuthorization(
        authorizations,
        marketplaceAddress,
        contractAddresses.MANAToken,
        AuthorizationType.ALLOWANCE
      )
    ) {
      handleExecuteOrder()
    } else {
      setShowAuthorizationModal(true)
    }
  }, [
    marketplaceAddress,
    authorizations,
    handleExecuteOrder,
    setShowAuthorizationModal
  ])

  const handleClose = useCallback(() => setShowAuthorizationModal(false), [
    setShowAuthorizationModal
  ])

  const isDisabled =
    !order ||
    isOwner ||
    notEnoughMana ||
    (!fingerprint && order.category === NFTCategory.ESTATE)

  const name = <b>{getNFTName(nft)}</b>
  const Price = (props: { price: string }) => (
    <Mana inline>{formatMANA(props.price)}</Mana>
  )

  let subtitle = null
  if (!order) {
    subtitle = <T id={'buy_page.not_for_sale'} values={{ name }} />
  } else if (
    !fingerprint &&
    order.category === NFTCategory.ESTATE &&
    !isFingerprintLoading
  ) {
    subtitle = <T id={'buy_page.no_fingerprint'} />
  } else if (isOwner) {
    subtitle = <T id={'buy_page.is_owner'} values={{ name }} />
  } else if (notEnoughMana) {
    subtitle = (
      <T
        id={'buy_page.not_enough_mana'}
        values={{ name, amount: <Price price={order.price} /> }}
      />
    )
  } else if (isPartner(nft.vendor) && computedPrice) {
    subtitle = (
      <>
        <T
          id={'buy_page.subtitle'}
          values={{
            name,
            amount: <Price price={order.price} />
          }}
        />
        {isAboveMaxPercentage ? (
          <div className="error">
            {t('buy_page.price_too_high', {
              category: t(`global.${nft.category}`),
              percentageIncrease
            })}
            <br />
            {t('buy_page.please_wait')}
          </div>
        ) : percentageIncrease > 0 ? (
          <div>
            <T
              id="buy_page.actual_price"
              values={{
                computedPrice: <Price price={computedPrice} />
              }}
            />
          </div>
        ) : null}
      </>
    )
  } else {
    subtitle = (
      <T
        id={'buy_page.subtitle'}
        values={{
          name,
          amount: <Price price={order.price} />
        }}
      />
    )
  }

  return (
    <NFTAction nft={nft}>
      <Header size="large">
        {t('buy_page.title', { category: t(`global.${nft.category}`) })}
      </Header>
      <div className={isDisabled ? 'error' : ''}>{subtitle}</div>
      <div className="buttons">
        <Button
          onClick={() =>
            onNavigate(locations.nft(nft.contractAddress, nft.tokenId))
          }
        >
          {t('global.cancel')}
        </Button>

        {isDisabled ||
        !isAboveMaxPercentage ||
        (isAboveMaxPercentage && wantsToProceed) ? (
          <Button
            primary
            disabled={isDisabled || isLoading}
            onClick={handleSubmit}
            loading={isLoading}
          >
            {t('buy_page.buy')}
          </Button>
        ) : (
          <Button
            primary
            onClick={handleToggleWantsToProceed}
            loading={isLoading}
          >
            {t('buy_page.proceed_anyways')}
          </Button>
        )}
      </div>
      <AuthorizationModal
        open={showAuthorizationModal}
        contractAddress={marketplaceAddress}
        tokenAddress={contractAddresses.MANAToken}
        type={AuthorizationType.ALLOWANCE}
        onProceed={handleExecuteOrder}
        onCancel={handleClose}
      />
    </NFTAction>
  )
}

export default React.memo(BuyPage)
