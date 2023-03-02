import React, { useState, useCallback, useMemo } from 'react'
import compact from 'lodash/compact'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { NFTCategory } from '@dcl/schemas'
import { Header, Button, Mana, Icon } from 'decentraland-ui'
import { ContractName } from 'decentraland-transactions'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { hasAuthorization } from 'decentraland-dapps/dist/modules/authorization/utils'
import { ChainButton } from 'decentraland-dapps/dist/containers'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { isWearableOrEmote } from '../../../modules/asset/utils'
import { locations } from '../../../modules/routing/locations'
import { useFingerprint } from '../../../modules/nft/hooks'
import { getContractNames } from '../../../modules/vendor'
import { AssetType } from '../../../modules/asset/types'
import { AuthorizationModal } from '../../AuthorizationModal'
import { AssetAction } from '../../AssetAction'
import { Network as NetworkSubtitle } from '../../Network'
import PriceSubtitle from '../../Price'
import { AssetProviderPage } from '../../AssetProviderPage'
import { PriceTooLow } from '../PriceTooLow'
import { Name } from '../Name'
import { Price } from '../Price'
import { CardPaymentsExplanation } from '../CardPaymentsExplanation'
import { NotEnoughMana } from '../NotEnoughMana'
import { PriceHasChanged } from '../PriceHasChanged'
import { Props } from './BuyNFTModal.types'

const BuyNFTModal = (props: Props) => {
  const {
    nft,
    order,
    wallet,
    authorizations,
    isLoading,
    isOwner,
    hasInsufficientMANA,
    hasLowPrice,

    isBuyWithCardPage,
    getContract,
    onExecuteOrder,
    onExecuteOrderWithCard
  } = props

  const [fingerprint, isFingerprintLoading] = useFingerprint(nft)
  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)

  const analytics = getAnalytics()

  const handleExecuteOrder = useCallback(() => {
    if (isBuyWithCardPage) {
      analytics.track('Click on Buy NFT With Card')
      return onExecuteOrderWithCard(nft)
    }

    onExecuteOrder(order!, nft, fingerprint)
  }, [
    isBuyWithCardPage,
    onExecuteOrderWithCard,
    onExecuteOrder,
    order,
    nft,
    fingerprint,
    analytics
  ])

  const handleCancel = useCallback(() => {
    if (isBuyWithCardPage) analytics.track('Cancel Buy NFT With Card')
  }, [analytics, isBuyWithCardPage])

  const authorization: Authorization | null = useMemo(() => {
    const contractNames = getContractNames()

    const mana = getContract({
      name: contractNames.MANA,
      network: nft.network
    })

    // If the vendor is a partner we might need to use a different contract for authorizedAddress. See PR #680
    return mana
      ? {
          address: wallet.address,
          authorizedAddress: order!.marketplaceAddress,
          contractAddress: mana.address,
          contractName: ContractName.MANAToken,
          chainId: nft.chainId,
          type: AuthorizationType.ALLOWANCE
        }
      : null
  }, [getContract, nft.network, nft.chainId, wallet.address, order])

  const handleSubmit = useCallback(() => {
    if (
      (authorization && hasAuthorization(authorizations, authorization)) ||
      isBuyWithCardPage
    ) {
      handleExecuteOrder()
    } else {
      setShowAuthorizationModal(true)
    }
  }, [
    authorizations,
    authorization,
    handleExecuteOrder,
    isBuyWithCardPage,
    setShowAuthorizationModal
  ])

  const handleClose = useCallback(() => setShowAuthorizationModal(false), [
    setShowAuthorizationModal
  ])

  const isDisabled =
    !order ||
    isOwner ||
    (hasInsufficientMANA && !isBuyWithCardPage) ||
    (!fingerprint && nft.category === NFTCategory.ESTATE)

  const name = <Name asset={nft} />

  const translationPageDescriptorId = compact([
    'buy',
    isWearableOrEmote(nft)
      ? isBuyWithCardPage
        ? 'with_card'
        : 'with_mana'
      : null,
    'page'
  ]).join('_')

  let subtitle = null
  if (!order) {
    subtitle = (
      <T id={`${translationPageDescriptorId}.not_for_sale`} values={{ name }} />
    )
  } else if (
    !fingerprint &&
    nft.category === NFTCategory.ESTATE &&
    !isFingerprintLoading
  ) {
    subtitle = <T id={`${translationPageDescriptorId}.no_fingerprint`} />
  } else if (isOwner) {
    subtitle = (
      <T id={`${translationPageDescriptorId}.is_owner`} values={{ name }} />
    )
  } else if (hasInsufficientMANA && !isBuyWithCardPage) {
    const description = (
      <T
        id={`${translationPageDescriptorId}.not_enough_mana`}
        values={{
          name,
          amount: <Price network={nft.network} price={order.price} />
        }}
      />
    )
    subtitle = isWearableOrEmote(nft) ? (
      <NotEnoughMana asset={nft} description={description} />
    ) : (
      description
    )
  } else {
    subtitle = isWearableOrEmote(nft) ? (
      <div className="subtitle-wrapper">
        <PriceSubtitle asset={nft} />
        <NetworkSubtitle asset={nft} />
      </div>
    ) : (
      <T
        id={`${translationPageDescriptorId}.subtitle`}
        values={{
          name,
          amount: <Price network={nft.network} price={order.price} />
        }}
      />
    )
  }

  return (
    <AssetAction asset={nft}>
      <Header size="large">
        {t(`${translationPageDescriptorId}.title`, {
          name,
          category: t(`global.${nft.category}`)
        })}
      </Header>
      <div className={isDisabled ? 'error' : ''}>{subtitle}</div>
      <AssetProviderPage type={AssetType.NFT}>
        {(asset, newOrder) => {
          return newOrder && order && newOrder.price !== order.price ? (
            <PriceHasChanged asset={asset} newPrice={newOrder.price} />
          ) : null
        }}
      </AssetProviderPage>
      {hasLowPrice && !isBuyWithCardPage ? (
        <PriceTooLow chainId={nft.chainId} network={nft.network} />
      ) : null}
      <div
        className={classNames('buttons', isWearableOrEmote(nft) && 'with-mana')}
      >
        <Button
          as={Link}
          to={locations.nft(nft.contractAddress, nft.tokenId)}
          onClick={handleCancel}
        >
          {!isBuyWithCardPage && (hasLowPrice || hasInsufficientMANA)
            ? t('global.go_back')
            : t('global.cancel')}
        </Button>
        {(!hasInsufficientMANA && !hasLowPrice) || isBuyWithCardPage ? (
          <ChainButton
            primary
            disabled={isDisabled || isLoading}
            onClick={handleSubmit}
            loading={isLoading}
            chainId={nft.chainId}
          >
            {isWearableOrEmote(nft) ? (
              isBuyWithCardPage ? (
                <Icon name="credit card outline" />
              ) : (
                <Mana inline size="small" network={nft.network} />
              )
            ) : null}
            {t(`${translationPageDescriptorId}.buy`)}
          </ChainButton>
        ) : null}
      </div>
      {isWearableOrEmote(nft) && isBuyWithCardPage ? (
        <CardPaymentsExplanation
          translationPageDescriptorId={translationPageDescriptorId}
        />
      ) : null}
      {authorization ? (
        <AuthorizationModal
          open={showAuthorizationModal}
          authorization={authorization}
          onProceed={handleExecuteOrder}
          onCancel={handleClose}
        />
      ) : null}
    </AssetAction>
  )
}

export default React.memo(BuyNFTModal)
