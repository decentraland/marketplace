import React, { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import compact from 'lodash/compact'
import classNames from 'classnames'
import { Header, Button, Mana, Icon } from 'decentraland-ui'
import { Item } from '@dcl/schemas'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Authorization,
  AuthorizationType
} from 'decentraland-dapps/dist/modules/authorization/types'
import { ContractName } from 'decentraland-transactions'
import { hasAuthorizationAndEnoughAllowance } from 'decentraland-dapps/dist/modules/authorization/utils'
import { ChainButton } from 'decentraland-dapps/dist/containers'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { locations } from '../../../modules/routing/locations'
import { AuthorizationModal } from '../../AuthorizationModal'
import { getContractNames } from '../../../modules/vendor'
import { Section } from '../../../modules/vendor/decentraland'
import { AssetType } from '../../../modules/asset/types'
import { isWearableOrEmote } from '../../../modules/asset/utils'
import * as events from '../../../utils/events'
import { AssetAction } from '../../AssetAction'
import { Network as NetworkSubtitle } from '../../Network'
import PriceSubtitle from '../../Price'
import { AssetProviderPage } from '../../AssetProviderPage'
import { Name } from '../Name'
import { Price } from '../Price'
import { PriceTooLow } from '../PriceTooLow'
import { CardPaymentsExplanation } from '../CardPaymentsExplanation'
import { NotEnoughMana } from '../NotEnoughMana'
import { PriceHasChanged } from '../PriceHasChanged'
import { Props } from './MintItemModal.types'

const MintItemModal = (props: Props) => {
  const {
    item,
    wallet,
    authorizations,
    isLoading,
    isOwner,
    hasInsufficientMANA,
    hasLowPrice,
    isBuyWithCardPage,
    getContract,
    onBuyItem,
    onBuyItemWithCard
  } = props

  const [showAuthorizationModal, setShowAuthorizationModal] = useState(false)

  const analytics = getAnalytics()

  const handleExecuteOrder = useCallback(() => {
    if (isBuyWithCardPage) {
      analytics.track(events.CLICK_BUY_NFT_WITH_CARD)
      return onBuyItemWithCard(item)
    }

    onBuyItem(item)
  }, [isBuyWithCardPage, onBuyItemWithCard, onBuyItem, item, analytics])

  const handleCancel = useCallback(() => {
    if (isBuyWithCardPage) analytics.track(events.CANCEL_BUY_NFT_WITH_CARD)
  }, [analytics, isBuyWithCardPage])

  const authorization: Authorization | null = useMemo(() => {
    const contractNames = getContractNames()
    const mana = getContract({
      name: contractNames.MANA,
      network: item.network
    })

    const collectionStore = getContract({
      name: contractNames.COLLECTION_STORE,
      network: item.network
    })

    return mana && collectionStore
      ? {
          address: wallet.address,
          authorizedAddress: collectionStore.address,
          contractAddress: mana.address,
          contractName: ContractName.MANAToken,
          chainId: item.chainId,
          type: AuthorizationType.ALLOWANCE
        }
      : null
  }, [getContract, item.network, item.chainId, wallet.address])

  const shouldUpdateSpendingCap: boolean = useMemo<boolean>(() => {
    return (
      !!authorizations &&
      !!authorization &&
      !!item?.price &&
      !hasAuthorizationAndEnoughAllowance(
        authorizations,
        authorization,
        item.price
      )
    )
  }, [authorizations, authorization, item?.price])

  const handleSubmit = useCallback(() => {
    if (
      (authorization &&
        hasAuthorizationAndEnoughAllowance(
          authorizations,
          authorization,
          item.price
        )) ||
      isBuyWithCardPage
    ) {
      handleExecuteOrder()
    } else {
      setShowAuthorizationModal(true)
    }
  }, [
    authorization,
    authorizations,
    handleExecuteOrder,
    isBuyWithCardPage,
    item.price
  ])

  const handleClose = useCallback(() => setShowAuthorizationModal(false), [
    setShowAuthorizationModal
  ])

  const isDisabled =
    !item.price || isOwner || (hasInsufficientMANA && !isBuyWithCardPage)

  const name = <Name asset={item} />

  const translationPageDescriptorId = compact([
    'mint',
    isWearableOrEmote(item)
      ? isBuyWithCardPage
        ? 'with_card'
        : 'with_mana'
      : null,
    'page'
  ]).join('_')

  let subtitle = null
  if (!item.isOnSale) {
    subtitle = (
      <T
        id={`${translationPageDescriptorId}.not_for_sale`}
        values={{
          name,
          secondary_market_link: (
            <Link
              to={locations.browse({
                section: Section.WEARABLES,
                assetType: AssetType.NFT,
                search: item.name
              })}
            >
              {t(`${translationPageDescriptorId}.secondary_market`)}
            </Link>
          )
        }}
      />
    )
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
          amount: <Price network={item.network} price={item.price} />
        }}
      />
    )
    subtitle = isWearableOrEmote(item) ? (
      <NotEnoughMana asset={item} description={description} />
    ) : (
      description
    )
  } else {
    subtitle = isWearableOrEmote(item) ? (
      <div className="subtitle-wrapper">
        <PriceSubtitle asset={item} />
        <NetworkSubtitle asset={item} />
      </div>
    ) : (
      <T
        id={`${translationPageDescriptorId}.subtitle`}
        values={{
          name,
          amount: <Price network={item.network} price={item.price} />
        }}
      />
    )
  }

  return (
    <AssetAction asset={item}>
      <Header size="large">
        {t(`${translationPageDescriptorId}.title`, {
          name,
          category: t(`global.${item.category}`)
        })}
      </Header>
      <div className={isDisabled ? 'error' : ''}>{subtitle}</div>
      <AssetProviderPage type={AssetType.ITEM}>
        {(asset: Item) => {
          return asset.price !== item.price ? (
            <PriceHasChanged asset={item} newPrice={asset.price} />
          ) : null
        }}
      </AssetProviderPage>
      {hasLowPrice && !isBuyWithCardPage ? (
        <PriceTooLow chainId={item.chainId} network={item.network} />
      ) : null}
      <div
        className={classNames(
          'buttons',
          isWearableOrEmote(item) && 'with-mana'
        )}
      >
        <Button
          as={Link}
          to={locations.item(item.contractAddress, item.itemId)}
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
            chainId={item.chainId}
          >
            {isWearableOrEmote(item) ? (
              isBuyWithCardPage ? (
                <Icon name="credit card outline" />
              ) : (
                <Mana inline size="small" network={item.network} />
              )
            ) : null}
            {t(`${translationPageDescriptorId}.action`)}
          </ChainButton>
        ) : null}
      </div>
      {isWearableOrEmote(item) && isBuyWithCardPage ? (
        <CardPaymentsExplanation
          translationPageDescriptorId={translationPageDescriptorId}
        />
      ) : null}
      {authorization ? (
        <AuthorizationModal
          isLoading={isLoading}
          open={showAuthorizationModal}
          authorization={authorization}
          shouldUpdateSpendingCap={shouldUpdateSpendingCap}
          onProceed={handleExecuteOrder}
          onCancel={handleClose}
        />
      ) : null}
    </AssetAction>
  )
}

export default React.memo(MintItemModal)
