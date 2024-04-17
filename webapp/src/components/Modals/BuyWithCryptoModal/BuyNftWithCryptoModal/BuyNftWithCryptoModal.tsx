import React, { useCallback } from 'react'
import { Contract, NFTCategory } from '@dcl/schemas'
import withAuthorizedAction from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization'
import { ContractName } from 'decentraland-transactions'
import { useFingerprint } from '../../../../modules/nft/hooks'
import { getBuyItemStatus, getError } from '../../../../modules/order/selectors'
import { getContractNames } from '../../../../modules/vendor'
import { Contract as DCLContract } from '../../../../modules/vendor/services'
import * as events from '../../../../utils/events'
import BuyWithCryptoModal from '../BuyWithCryptoModal.container'
import { OnGetCrossChainRoute, OnGetGasCost } from '../BuyWithCryptoModal.types'
import { useBuyNftGasCost, useCrossChainBuyNftRoute } from '../hooks'
import { Props } from './BuyNftWithCryptoModal.types'

const BuyNftWithCryptoModalHOC = (props: Props) => {
  const {
    name,
    isExecutingOrder,
    isExecutingOrderCrossChain,
    onClose,
    isLoadingAuthorization,
    getContract,
    onAuthorizedAction,
    onExecuteOrder,
    onExecuteOrderCrossChain,
    onExecuteOrderWithCard,
    metadata: { nft, order, slippage = 1 }
  } = props

  const [fingerprint] = useFingerprint(nft)

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

    onAuthorizedAction({
      targetContractName: ContractName.MANAToken,
      authorizationType: AuthorizationType.ALLOWANCE,
      authorizedAddress: order.marketplaceAddress,
      targetContract: mana as Contract,
      authorizedContractLabel: marketplace.label || marketplace.name,
      requiredAllowanceInWei: order.price,
      onAuthorized: (alreadyAuthorized: boolean) => onExecuteOrder(order, nft, fingerprint, !alreadyAuthorized) // undefined as fingerprint
    })
  }, [nft, order, fingerprint, getContract, onAuthorizedAction, onExecuteOrder])

  const onBuyWithCard = useCallback(() => {
    getAnalytics().track(events.CLICK_BUY_NFT_WITH_CARD)
    onExecuteOrderWithCard(nft)
  }, [nft])

  const onGetCrossChainRoute: OnGetCrossChainRoute = useCallback(
    (selectedToken, selectedChain, providerTokens, crossChainProvider, wallet) =>
      useCrossChainBuyNftRoute(order, order.chainId, selectedToken, selectedChain, providerTokens, crossChainProvider, wallet, slippage),
    [order]
  )
  const onGetGasCost: OnGetGasCost = useCallback(
    (selectedToken, chainNativeToken, wallet) => useBuyNftGasCost(nft, order, selectedToken, chainNativeToken, wallet, fingerprint),
    [nft, order, fingerprint]
  )

  return (
    <BuyWithCryptoModal
      price={order.price}
      isBuyingAsset={isExecutingOrder || isExecutingOrderCrossChain}
      onBuyNatively={onBuyNatively}
      onBuyWithCard={nft.category === NFTCategory.ESTATE || nft.category === NFTCategory.PARCEL ? undefined : onBuyWithCard}
      onBuyCrossChain={onExecuteOrderCrossChain}
      onGetGasCost={onGetGasCost}
      isLoadingAuthorization={isLoadingAuthorization}
      onGetCrossChainRoute={onGetCrossChainRoute}
      metadata={{ asset: nft }}
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
