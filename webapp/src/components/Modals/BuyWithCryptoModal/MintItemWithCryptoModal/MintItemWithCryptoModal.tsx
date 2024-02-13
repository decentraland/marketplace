import React, { useCallback } from 'react'
import { Contract } from '@dcl/schemas'
import { withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { Contract as DCLContract } from '../../../../modules/vendor/services'
import { getContractNames } from '../../../../modules/vendor'
import { BuyWithCryptoModal } from '../BuyWithCryptoModal'
import {
  useCrossChainMintNftRoute,
  useMintingNftGasCost,
  useTokenBalance
} from '../hooks'
import { ContractName } from 'decentraland-transactions'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { getMintItemStatus } from '../../../../modules/item/selectors'

const MintNFTWithCryptoModalHOC = (props: Props) => {
  const {
    // Use wallet selector?
    wallet,
    metadata: { item },
    // Use selector?
    getContract: getContractProp,
    // Use selector?
    isLoading,
    // Use selector?
    isLoadingBuyCrossChain,
    // Use selector?
    isLoadingAuthorization,
    // Use selector?
    isSwitchingNetwork,
    // Use selector?
    isBuyWithCardPage,
    // Use selector?
    onAuthorizedAction,
    // Use selector?
    onSwitchNetwork,
    // Use selector?
    onBuyItem: onBuyItemProp,
    // Use selector?
    onBuyItemThroughProvider,
    onBuyWithCard: onBuyItemWithCard,
    // onExecuteOrder,
    // onExecuteOrderWithCard,
    onGetMana,
    onClose
  } = props

  const onBuyNatively = useCallback(() => {
    const contractNames = getContractNames()

    const mana = getContractProp({
      name: contractNames.MANA,
      network: item.network
    }) as DCLContract

    const collectionStore = getContractProp({
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
      onAuthorized: () => onBuyItemProp(item)
    })
  }, [item, getContractProp, onAuthorizedAction, onBuyItemProp])

  const onBuyWithCard = useCallback(() => onBuyItemWithCard(item), [item])

  const crossChainRoute = useCrossChainMintNftRoute(
    item,
    item.chainId,
    selectedToken,
    selectedChain,
    providerTokens,
    crossChainProvider,
    wallet
  )

  const gasCost = useMintingNftGasCost(
    item,
    selectedToken,
    selectedChain,
    wallet,
    providerTokens
  )

  return (
    <BuyWithCryptoModal
      wallet={wallet}
      isLoading={isLoading}
      isLoadingBuyCrossChain={isLoadingBuyCrossChain}
      isSwitchingNetwork={isSwitchingNetwork}
      onSwitchNetwork={onSwitchNetwork}
      onBuyNatively={onBuyNatively}
      onBuyWithCard={onBuyWithCard}
      onBuyCrossChain={onBuyItemThroughProvider}
      price={item.price}
      assetNetwork={item.chainId}
      metadata={{ asset: item }}
    />
  )
}

export const MintNFTWithCryptoModal = React.memo(
  withAuthorizedAction(
    BuyWithCryptoModal,
    AuthorizedAction.MINT,
    {
      action: 'mint_with_mana_page.authorization.action',
      title_action: 'mint_with_mana_page.authorization.title_action'
    },
    getMintItemStatus,
    getError
  )
)
