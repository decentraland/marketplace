import React, { useCallback, useMemo, useState } from 'react'
import { Contract, NFTCategory } from '@dcl/schemas'
import withAuthorizedAction from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { ContractName, getContractName, getContract as getDCLContract } from 'decentraland-transactions'
import { EstateSnapshotStatus, isEstateSnapshotBlocking, useEstateSnapshot } from '../../../../modules/nft/hooks'
import { getBuyItemStatus, getError } from '../../../../modules/order/selectors'
import { useCheckoutPriceInMana } from '../../../../modules/trade/hooks'
import { getTransakPurchase, isTransakSupported } from '../../../../modules/transak/utils'
import { getContractNames } from '../../../../modules/vendor'
import { Contract as DCLContract } from '../../../../modules/vendor/services'
import * as events from '../../../../utils/events'
import BuyWithCryptoModal from '../BuyWithCryptoModal.container'
import { OnGetCrossChainRoute, OnGetGasCost } from '../BuyWithCryptoModal.types'
import { CheckoutPriceUnavailableModal } from '../CheckoutPriceUnavailableModal'
import { useBuyNftGasCost, useCrossChainBuyNftRoute } from '../hooks'
import { manaAfterCredits } from '../utils'
import { Props } from './BuyNftWithCryptoModal.types'

const BuyNftWithCryptoModalHOC = (props: Props) => {
  const {
    name,
    credits,
    isExecutingOrder,
    connectedChainId,
    isExecutingOrderCrossChain,
    onClose,
    isLoadingAuthorization,
    isUsingMagic,
    getContract,
    onAuthorizedAction,
    onExecuteOrder,
    onExecuteOrderCrossChain,
    onExecuteOrderWithCard,
    metadata: { nft, order, slippage = 1, useCredits = false }
  } = props

  // `order.price` carries no unit: on a USD-pegged trade it is USD wei rather than MANA wei. The figures below —
  // the price shown, the balance check, the allowance, the total — are all in MANA, so they come from here
  // instead of from `order.price`.
  const checkoutPrice = useCheckoutPriceInMana(order.price, nft.network, order.tradeId)
  const priceInMana = checkoutPrice.manaWei

  // The purchase records which LANDs the Estate contains. It is made against the
  // composition read when this checkout opened — the one shown on the asset page
  // it was opened from — and not against whatever the registry holds by the time
  // the order is signed.
  const estateComposition = useEstateSnapshot(nft)
  const [hasEstateChanged, setHasEstateChanged] = useState(false)
  const isEstateBlocked = isEstateSnapshotBlocking(estateComposition) || hasEstateChanged

  const onBuyNatively = useCallback(() => {
    const contractNames = getContractNames()

    const mana = getContract({
      name: contractNames.MANA,
      network: nft.network
    }) as DCLContract

    const marketplace = getContract({
      address: order.marketplaceAddress,
      network: nft.network
    }) as DCLContract

    const offchainContractName = order.marketplaceAddress ? getContractName(order.marketplaceAddress) : ContractName.OffChainMarketplace // if the trade doesn't have a contract address, use the default marketplace contract

    const offchainMarketplace = order?.tradeId && getDCLContract(offchainContractName, nft.chainId)

    let creditsManager
    try {
      creditsManager = getDCLContract(ContractName.CreditsManager, nft.chainId)
    } catch (error) {
      console.log('Error getting credit manager', error)
    }

    // Not reachable from the UI (nothing renders until the price resolves), but this builds an allowance
    // request, so it does not run on an unknown amount.
    if (priceInMana === null) {
      return
    }

    const areCreditsEnoughToBuy = useCredits && credits && BigInt(credits.totalCredits) >= BigInt(priceInMana)
    const needsToAuthorizeCredits = useCredits && !areCreditsEnoughToBuy

    const authorizedAddress =
      needsToAuthorizeCredits && creditsManager
        ? creditsManager.address
        : offchainMarketplace
          ? offchainMarketplace.address
          : order.marketplaceAddress
    const authorizedContractLabel =
      needsToAuthorizeCredits && creditsManager
        ? creditsManager.name
        : offchainMarketplace
          ? offchainMarketplace.name
          : marketplace.label || marketplace.name

    onAuthorizedAction({
      // Override the automatic Magic sign in if the user needs to pay gas for the transaction
      manual: connectedChainId === nft.chainId,
      targetContractName: ContractName.MANAToken,
      authorizationType: AuthorizationType.ALLOWANCE,
      authorizedAddress,
      targetContract: mana as Contract,
      authorizedContractLabel,
      requiredAllowanceInWei: manaAfterCredits(priceInMana, useCredits ? credits : null),
      onAuthorized: (alreadyAuthorized: boolean) => {
        void (async () => {
          if (!(await estateComposition.confirm())) {
            setHasEstateChanged(true)
            return
          }
          onExecuteOrder(order, nft, estateComposition.fingerprint, !alreadyAuthorized, useCredits)
        })()
      }
    })
  }, [nft, order, priceInMana, estateComposition, getContract, onAuthorizedAction, onExecuteOrder, useCredits, credits, connectedChainId])

  const onBuyWithCard = useCallback(() => {
    getAnalytics()?.track(events.CLICK_BUY_NFT_WITH_CARD)
    onExecuteOrderWithCard(nft, order, useCredits)
  }, [nft, order, useCredits, onExecuteOrderWithCard])

  const onGetCrossChainRoute: OnGetCrossChainRoute = useCallback(
    (selectedToken, selectedChain, providerTokens, crossChainProvider, wallet) => {
      // The early return below keeps this modal off screen until the amount resolves, so the callbacks it
      // hands out always have one. Falling back to `order.price` here would route the unconverted amount.
      if (priceInMana === null) {
        throw new Error('The listing price has not resolved yet')
      }
      return useCrossChainBuyNftRoute(
        order,
        priceInMana,
        order.chainId,
        selectedToken,
        selectedChain,
        providerTokens,
        crossChainProvider,
        wallet,
        slippage
      )
    },
    [order, priceInMana, slippage]
  )
  const onGetGasCost: OnGetGasCost = useCallback(
    (selectedToken, chainNativeToken, wallet) =>
      useBuyNftGasCost(nft, order, selectedToken, chainNativeToken, wallet, estateComposition.fingerprint),
    [nft, order, estateComposition.fingerprint]
  )

  const price = useMemo(
    () => (priceInMana === null ? null : manaAfterCredits(priceInMana, useCredits ? credits : null)),
    [priceInMana, useCredits, credits]
  )

  // Without a resolved amount there is nothing to confirm. `resolving` is the trade read (a cache hit for
  // anyone who came through the asset page); `unavailable` is an unreadable trade or an unreachable oracle.
  if (price === null || priceInMana === null) {
    return <CheckoutPriceUnavailableModal name={name} isLoading={checkoutPrice.status === 'resolving'} onClose={onClose} />
  }

  // Nothing is put up for approval until the LANDs the Estate contains are known to be the ones the asset
  // page showed. `hasEstateChanged` covers a composition that moved between opening this checkout and signing.
  if (isEstateBlocked) {
    return (
      <CheckoutPriceUnavailableModal
        name={name}
        isLoading={estateComposition.status === EstateSnapshotStatus.LOADING}
        title={t('estate_composition.modal_title')}
        description={
          hasEstateChanged
            ? t('estate_composition.changed')
            : estateComposition.status === EstateSnapshotStatus.OUT_OF_SYNC
              ? t('estate_composition.out_of_sync', { count: estateComposition.snapshot?.parcels.length ?? 0 })
              : t('estate_composition.unavailable')
        }
        // Only a failed read is worth retrying here: a composition that disagrees with the page needs the
        // page reloaded, and a pending one is already showing a spinner.
        onRetry={estateComposition.status === EstateSnapshotStatus.UNAVAILABLE ? estateComposition.retry : undefined}
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
      isBuyingAsset={isExecutingOrder || isExecutingOrderCrossChain}
      onBuyNatively={onBuyNatively}
      // The card flow buys a fixed amount of MANA up front, so it cannot cover a price the contract
      // recomputes from its oracle at accept time. Not offered for a pegged listing until it can.
      onBuyWithCard={
        nft.category === NFTCategory.ESTATE ||
        nft.category === NFTCategory.PARCEL ||
        checkoutPrice.isUSDPegged ||
        // Transak calls `accept` on the marketplace this listing was signed against, so a version it has
        // no registration for cannot be executed at all — withheld like the pegged case above.
        !isTransakSupported({ ...getTransakPurchase(nft, order), canUseCredits: useCredits })
          ? undefined
          : onBuyWithCard
      }
      onBuyCrossChain={onExecuteOrderCrossChain}
      onGetGasCost={onGetGasCost}
      isUsingMagic={isUsingMagic}
      isLoadingAuthorization={isLoadingAuthorization}
      onGetCrossChainRoute={onGetCrossChainRoute}
      metadata={{ asset: nft }}
      strictEstateSelection={!!estateComposition.snapshot}
      name={name}
      onClose={onClose}
    />
  )
}

export const BuyNftWithCryptoModal = React.memo(
  withAuthorizedAction(
    BuyNftWithCryptoModalHOC,
    AuthorizedAction.BUY,
    {
      action: 'buy_with_mana_page.authorization.action',
      title_action: 'buy_with_mana_page.authorization.title_action'
    },
    getBuyItemStatus,
    getError
  )
)
