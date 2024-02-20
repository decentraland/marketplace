import React, { useCallback } from 'react'
import { Contract } from '@dcl/schemas'
import { ContractName } from 'decentraland-transactions'
import { withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { Contract as DCLContract } from '../../../../modules/vendor/services'
import { getContractNames } from '../../../../modules/vendor'
import { getMintItemStatus, getError } from '../../../../modules/item/selectors'
import { useCrossChainMintNftRoute, useMintingNftGasCost } from '../hooks'
import BuyWithCryptoModal from '../BuyWithCryptoModal.container'
import { Props } from './MintNftWithCryptoModal.types'
import { OnGetCrossChainRoute, OnGetGasCost } from '../BuyWithCryptoModal.types'

const MintNftWithCryptoModalHOC = (props: Props) => {
  const {
    name,
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

  const onBuyWithCard = useCallback(() => onBuyItemWithCard(item), [item])
  const onGetCrossChainRoute: OnGetCrossChainRoute = useCallback(
    (
      selectedToken,
      selectedChain,
      providerTokens,
      crossChainProvider,
      wallet
    ) =>
      useCrossChainMintNftRoute(
        item,
        item.chainId,
        selectedToken,
        selectedChain,
        providerTokens,
        crossChainProvider,
        wallet
      ),
    [item]
  )
  const onGetGasCost: OnGetGasCost = useCallback(
    (selectedToken, selectedChain, wallet, providerTokens) =>
      useMintingNftGasCost(
        item,
        selectedToken,
        selectedChain,
        wallet,
        providerTokens
      ),
    [item]
  )

  return (
    <BuyWithCryptoModal
      price={item.price}
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
