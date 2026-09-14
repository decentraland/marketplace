import React, { useCallback, useMemo } from 'react'
import { Contract } from '@dcl/schemas'
import { withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ContractName, getContractName, getContract as getDCLContract } from 'decentraland-transactions'
import { useIsIAP } from '../../../../modules/iap/useIAP'
import { getMintItemStatus, getError } from '../../../../modules/item/selectors'
import { useCheckoutPriceInMana } from '../../../../modules/trade/hooks'
import { getContractNames } from '../../../../modules/vendor'
import { Contract as DCLContract } from '../../../../modules/vendor/services'
import * as events from '../../../../utils/events'
import BuyWithCryptoModal from '../BuyWithCryptoModal.container'
import { OnGetCrossChainRoute, OnGetGasCost } from '../BuyWithCryptoModal.types'
import { CheckoutPriceUnavailableModal } from '../CheckoutPriceUnavailableModal'
import { useCrossChainMintNftRoute, useMintingNftGasCost } from '../hooks'
import { manaAfterCredits } from '../utils'
import { Props } from './MintNftWithCryptoModal.types'

const MintNftWithCryptoModalHOC = (props: Props) => {
  const {
    name,
    connectedChainId,
    credits,
    metadata: { item, useCredits },
    isUsingMagic,
    isLoadingAuthorization,
    isBuyingItemNatively,
    isBuyingItemCrossChain,
    getContract,
    onAuthorizedAction,
    onBuyItem,
    onBuyItemCrossChain,
    onBuyWithCard: onBuyItemWithCard,
    onClose
  } = props

  // `item.price` carries no unit: on a USD-pegged trade it is USD wei rather than MANA wei. The figures below —
  // the price shown, the balance check, the allowance, the total — are all in MANA, so they come from here
  // instead of from `item.price`.
  const checkoutPrice = useCheckoutPriceInMana(item.price, item.network, item.tradeId)
  const priceInMana = checkoutPrice.manaWei
  const isIAP = useIsIAP()

  const onBuyNatively = useCallback(() => {
    // Not reachable from the UI (nothing renders until the price resolves), but this builds an allowance
    // request, so it does not run on an unknown amount.
    if (priceInMana === null) {
      return
    }

    const contractNames = getContractNames()

    const mana = getContract({
      name: contractNames.MANA,
      network: item.network
    }) as DCLContract

    const collectionStore = getContract({
      name: contractNames.COLLECTION_STORE,
      network: item.network
    }) as DCLContract
    const offchainContractName = item.tradeContractAddress ? getContractName(item.tradeContractAddress) : ContractName.OffChainMarketplace // if the trade doesn't have a contract address, use the default marketplace contract
    const offchainMarketplace = getDCLContract(offchainContractName, item.chainId)
    let creditsManager
    try {
      creditsManager = getDCLContract(ContractName.CreditsManager, item.chainId)
    } catch (error) {
      console.log('Error getting credit manager', error)
    }

    const areCreditsEnoughToBuy = useCredits && credits && BigInt(credits.totalCredits) >= BigInt(priceInMana)
    const needsToAuthorizeCredits = useCredits && !areCreditsEnoughToBuy

    const authorizedAddress =
      needsToAuthorizeCredits && creditsManager
        ? creditsManager.address
        : item.tradeId
          ? offchainMarketplace.address
          : collectionStore.address

    const authorizedContractLabel =
      needsToAuthorizeCredits && creditsManager
        ? creditsManager.name
        : item.tradeId
          ? offchainMarketplace.name
          : collectionStore.label || collectionStore.name

    onAuthorizedAction({
      // Override the automatic Magic sign in if the user needs to pay gas for the transaction
      manual: connectedChainId === item.chainId,
      targetContractName: ContractName.MANAToken,
      authorizationType: AuthorizationType.ALLOWANCE,
      authorizedAddress,
      targetContract: mana as Contract,
      authorizedContractLabel,
      requiredAllowanceInWei: manaAfterCredits(priceInMana, useCredits ? credits : null),
      onAuthorized: () => onBuyItem(item, useCredits)
    })
  }, [item, priceInMana, getContract, onAuthorizedAction, onBuyItem, useCredits, credits, connectedChainId])

  const onBuyWithCard = useCallback(() => {
    getAnalytics()?.track(events.CLICK_BUY_NFT_WITH_CARD)
    onBuyItemWithCard(item, useCredits)
  }, [item, useCredits, onBuyItemWithCard])

  const onGetCrossChainRoute: OnGetCrossChainRoute = useCallback(
    (selectedToken, selectedChain, providerTokens, crossChainProvider, wallet) => {
      // The early return below keeps this modal off screen until the amount resolves, so the callbacks it
      // hands out always have one. Falling back to `item.price` here would route the unconverted amount.
      if (priceInMana === null) {
        throw new Error('The listing price has not resolved yet')
      }
      return useCrossChainMintNftRoute(
        item,
        priceInMana,
        item.chainId,
        selectedToken,
        selectedChain,
        providerTokens,
        crossChainProvider,
        wallet
      )
    },
    [item, priceInMana]
  )
  const onGetGasCost: OnGetGasCost = useCallback(
    (selectedToken, chainNativeToken, wallet) => useMintingNftGasCost(item, selectedToken, chainNativeToken, wallet),
    [item]
  )

  const price = useMemo(
    () => (priceInMana === null ? null : manaAfterCredits(priceInMana, useCredits ? credits : null)),
    [priceInMana, useCredits, credits]
  )

  // Without a resolved amount there is nothing to confirm. `resolving` is the trade read (a cache hit for
  // anyone who came through the item page); `unavailable` is an unreadable trade or an unreachable oracle.
  if (price === null || priceInMana === null) {
    return <CheckoutPriceUnavailableModal name={name} isLoading={checkoutPrice.status === 'resolving'} onClose={onClose} />
  }

  // A mobile-IAP checkout is presented as a Credits purchase, so it must not fall through to
  // spending MANA. The credits selection is what the execution branch, the allowance and the
  // figure on screen all derive from, so without it nothing is put up for approval.
  if (isIAP && useCredits !== true) {
    return (
      <CheckoutPriceUnavailableModal
        name={name}
        isLoading={false}
        title={t('iap_payment_unavailable.title')}
        description={t('iap_payment_unavailable.description')}
        onClose={onClose}
      />
    )
  }

  return (
    <BuyWithCryptoModal
      price={price}
      priceBeforeCredits={priceInMana}
      isPriceApproximate={checkoutPrice.isUSDPegged}
      useCredits={useCredits}
      isBuyingAsset={isBuyingItemNatively || isBuyingItemCrossChain}
      onBuyNatively={onBuyNatively}
      // The card flow buys a fixed amount of MANA up front, so it cannot cover a price the contract
      // recomputes from its oracle at accept time. Not offered for a pegged listing until it can.
      onBuyWithCard={checkoutPrice.isUSDPegged ? undefined : onBuyWithCard}
      onBuyCrossChain={onBuyItemCrossChain}
      onGetGasCost={onGetGasCost}
      isUsingMagic={isUsingMagic}
      isLoadingAuthorization={isLoadingAuthorization}
      onGetCrossChainRoute={onGetCrossChainRoute}
      metadata={{ asset: item }}
      name={name}
      onClose={onClose}
    />
  )
}

export const MintNftWithCryptoModal = React.memo(
  withAuthorizedAction(
    MintNftWithCryptoModalHOC,
    AuthorizedAction.MINT,
    {
      action: 'mint_with_mana_page.authorization.action',
      title_action: 'mint_with_mana_page.authorization.title_action'
    },
    getMintItemStatus,
    getError
  )
)
