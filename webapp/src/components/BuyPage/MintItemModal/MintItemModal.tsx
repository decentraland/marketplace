import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import compact from 'lodash/compact'
import classNames from 'classnames'
import { Header, Button, Mana, Icon } from 'decentraland-ui'
import { Contract, Item } from '@dcl/schemas'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization/types'
import { ChainButton, withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { ContractName } from 'decentraland-transactions'
import { locations } from '../../../modules/routing/locations'
import { Contract as DCLContract } from '../../../modules/vendor/services'
import { getContractNames } from '../../../modules/vendor'
import { Section } from '../../../modules/vendor/decentraland'
import { AssetType } from '../../../modules/asset/types'
import { isWearableOrEmote } from '../../../modules/asset/utils'
import * as events from '../../../utils/events'
import { AssetAction } from '../../AssetAction'
import { Network as NetworkSubtitle } from '../../Network'
import PriceSubtitle from '../../Price'
import { AssetProviderPage } from '../../AssetProviderPage'
import { getMintItemStatus, getError } from '../../../modules/item/selectors'
import { Name } from '../Name'
import { Price } from '../Price'
import { PriceTooLow } from '../PriceTooLow'
import { CardPaymentsExplanation } from '../CardPaymentsExplanation'
import { NotEnoughMana } from '../NotEnoughMana'
import { PriceHasChanged } from '../PriceHasChanged'
import { PartiallySupportedNetworkCard } from '../PartiallySupportedNetworkCard'
import { Props } from './MintItemModal.types'

const MintItemModal = (props: Props) => {
  const {
    item,
    isLoading,
    isOwner,
    hasInsufficientMANA,
    hasLowPrice,
    isBuyWithCardPage,
    isLoadingAuthorization,
    getContract,
    onBuyItem,
    onBuyItemWithCard,
    onAuthorizedAction,
    onClearItemErrors
  } = props

  const analytics = getAnalytics()
  const contractNames = getContractNames()
  const mana = getContract({
    name: contractNames.MANA,
    network: item.network
  }) as DCLContract

  const collectionStore = getContract({
    name: contractNames.COLLECTION_STORE,
    network: item.network
  }) as DCLContract

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

  const handleSubmit = useCallback(() => {
    if (isBuyWithCardPage) {
      handleExecuteOrder()
      return
    }
    if (item) {
      onClearItemErrors()
      onAuthorizedAction({
        targetContractName: ContractName.MANAToken,
        authorizationType: AuthorizationType.ALLOWANCE,
        authorizedAddress: collectionStore.address,
        targetContract: mana as Contract,
        authorizedContractLabel: collectionStore.label || collectionStore.name,
        requiredAllowanceInWei: item.price,
        onAuthorized: handleExecuteOrder
      })
    }
  }, [
    item,
    isBuyWithCardPage,
    mana,
    collectionStore.address,
    collectionStore.name,
    handleExecuteOrder,
    onAuthorizedAction,
    onClearItemErrors,
    collectionStore.label
  ])

  const isDisabled = !item.price || isOwner || (hasInsufficientMANA && !isBuyWithCardPage)

  const name = <Name asset={item} />

  const translationPageDescriptorId = compact([
    'mint',
    isWearableOrEmote(item) ? (isBuyWithCardPage ? 'with_card' : 'with_mana') : null,
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
    subtitle = <T id={`${translationPageDescriptorId}.is_owner`} values={{ name }} />
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
    subtitle = isWearableOrEmote(item) ? <NotEnoughMana asset={item} description={description} /> : description
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
          return asset.price !== item.price ? <PriceHasChanged asset={item} newPrice={asset.price} /> : null
        }}
      </AssetProviderPage>
      {hasLowPrice && !isBuyWithCardPage ? <PriceTooLow chainId={item.chainId} network={item.network} /> : null}
      <PartiallySupportedNetworkCard asset={item} />
      <div className={classNames('buttons', isWearableOrEmote(item) && 'with-mana')}>
        <Button as={Link} to={locations.item(item.contractAddress, item.itemId)} onClick={handleCancel}>
          {!isBuyWithCardPage && (hasLowPrice || hasInsufficientMANA) ? t('global.go_back') : t('global.cancel')}
        </Button>
        {(!hasInsufficientMANA && !hasLowPrice) || isBuyWithCardPage ? (
          <ChainButton
            primary
            disabled={isDisabled || isLoading || isLoadingAuthorization}
            onClick={handleSubmit}
            loading={isLoading || isLoadingAuthorization}
            chainId={item.chainId}
          >
            {isWearableOrEmote(item) ? (
              isBuyWithCardPage ? (
                <Icon name="credit card outline" />
              ) : (
                <Mana showTooltip inline size="small" network={item.network} />
              )
            ) : null}
            {t(`${translationPageDescriptorId}.action`)}
          </ChainButton>
        ) : null}
      </div>
      {isWearableOrEmote(item) && isBuyWithCardPage ? (
        <CardPaymentsExplanation translationPageDescriptorId={translationPageDescriptorId} />
      ) : null}
    </AssetAction>
  )
}

export default React.memo(
  withAuthorizedAction(
    MintItemModal,
    AuthorizedAction.MINT,
    {
      action: 'mint_with_mana_page.authorization.action',
      title_action: 'mint_with_mana_page.authorization.title_action'
    },
    getMintItemStatus,
    getError
  )
)
