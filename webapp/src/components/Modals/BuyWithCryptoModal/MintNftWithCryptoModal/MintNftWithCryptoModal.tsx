import React, { useCallback } from 'react'
import { Contract } from '@dcl/schemas'
import { withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization'
import { ContractName } from 'decentraland-transactions'
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
    isBuyingItemNatively,
    isBuyingItemCrossChain,
    metadata: { item },
    isLoadingAuthorization,
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

    onAuthorizedAction({
      targetContractName: ContractName.MANAToken,
      authorizationType: AuthorizationType.ALLOWANCE,
      authorizedAddress: collectionStore.address,
      targetContract: mana as Contract,
      authorizedContractLabel: collectionStore.label || collectionStore.name,
      requiredAllowanceInWei: item.price,
      onAuthorized: () => onBuyItem(item)
    })
  }, [item, getContract, onAuthorizedAction, onBuyItem])

  const onBuyWithCard = useCallback(() => {
    getAnalytics().track(events.CLICK_BUY_NFT_WITH_CARD)
    onBuyItemWithCard(item)
  }, [item])

  const onGetCrossChainRoute: OnGetCrossChainRoute = useCallback(
    (selectedToken, selectedChain, providerTokens, crossChainProvider, wallet) =>
      useCrossChainMintNftRoute(item, item.chainId, selectedToken, selectedChain, providerTokens, crossChainProvider, wallet),
    [item]
  )
  const onGetGasCost: OnGetGasCost = useCallback(
    (selectedToken, chainNativeToken, wallet) => useMintingNftGasCost(item, selectedToken, chainNativeToken, wallet),
    [item]
  )

  return (
    <BuyWithCryptoModal
      price={item.price}
      isBuyingAsset={isBuyingItemNatively || isBuyingItemCrossChain}
      onBuyNatively={onBuyNatively}
      onBuyWithCard={onBuyWithCard}
      onBuyCrossChain={onBuyItemCrossChain}
      onGetGasCost={onGetGasCost}
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
