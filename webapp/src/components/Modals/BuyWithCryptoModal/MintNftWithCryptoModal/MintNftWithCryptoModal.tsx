import React, { useCallback, useMemo } from 'react'
import { Contract } from '@dcl/schemas'
import { withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization'
import { ContractName, getContractName, getContract as getDCLContract } from 'decentraland-transactions'
import { getMintItemStatus, getError } from '../../../../modules/item/selectors'
import { getContractNames } from '../../../../modules/vendor'
import { Contract as DCLContract } from '../../../../modules/vendor/services'
import * as events from '../../../../utils/events'
import BuyWithCryptoModal from '../BuyWithCryptoModal.container'
import { OnGetCrossChainRoute, OnGetGasCost } from '../BuyWithCryptoModal.types'
import { useCrossChainMintNftRoute, useMintingNftGasCost } from '../hooks'
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

  const onBuyNatively = useCallback(() => {
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

    const areCreditsEnoughToBuy = useCredits && credits && BigInt(credits.totalCredits) >= BigInt(item.price)
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
      requiredAllowanceInWei: useCredits && credits ? (BigInt(item.price) - BigInt(credits.totalCredits)).toString() : item.price,
      onAuthorized: () => onBuyItem(item, useCredits)
    })
  }, [item, getContract, onAuthorizedAction, onBuyItem, useCredits])

  const onBuyWithCard = useCallback(() => {
    getAnalytics()?.track(events.CLICK_BUY_NFT_WITH_CARD)
    onBuyItemWithCard(item, useCredits)
  }, [item, useCredits, onBuyItemWithCard])

  const onGetCrossChainRoute: OnGetCrossChainRoute = useCallback(
    (selectedToken, selectedChain, providerTokens, crossChainProvider, wallet) =>
      useCrossChainMintNftRoute(item, item.chainId, selectedToken, selectedChain, providerTokens, crossChainProvider, wallet),
    [item]
  )
  const onGetGasCost: OnGetGasCost = useCallback(
    (selectedToken, chainNativeToken, wallet) => useMintingNftGasCost(item, selectedToken, chainNativeToken, wallet),
    [item]
  )

  const price = useMemo(() => {
    if (!useCredits || !credits) return item.price
    const adjustedPrice = BigInt(item.price) - BigInt(credits.totalCredits)
    // Convert back to wei format
    return adjustedPrice < 0 ? '0' : adjustedPrice.toString()
  }, [item.price, useCredits, credits])

  return (
    <BuyWithCryptoModal
      price={price}
      useCredits={useCredits}
      isBuyingAsset={isBuyingItemNatively || isBuyingItemCrossChain}
      onBuyNatively={onBuyNatively}
      onBuyWithCard={onBuyWithCard}
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
