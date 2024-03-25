import React, { useCallback, useMemo } from 'react'
import { Contract, NFTCategory, Network } from '@dcl/schemas'
import { withAuthorizedAction } from 'decentraland-dapps/dist/containers'
import { AuthorizedAction } from 'decentraland-dapps/dist/containers/withAuthorizedAction/AuthorizationModal'
import { getChainIdByNetwork } from 'decentraland-dapps/dist/lib'
import { AuthorizationType } from 'decentraland-dapps/dist/modules/authorization'
import { ContractName } from 'decentraland-transactions'
import { config } from '../../../../config'
import { getClaimNameStatus, getErrorMessage } from '../../../../modules/ens/selectors'
import { PRICE_IN_WEI } from '../../../../modules/ens/utils'
import { NFT } from '../../../../modules/nft/types'
import { getContractNames, VendorName } from '../../../../modules/vendor'
import { Contract as DCLContract } from '../../../../modules/vendor/services'
import BuyWithCryptoModal from '../BuyWithCryptoModal.container'
import { OnGetCrossChainRoute, OnGetGasCost } from '../BuyWithCryptoModal.types'
import { useCrossChainNameMintingRoute, useNameMintingGasCost } from '../hooks'
import { Props } from './MintNameWithCryptoModal.types'

export const CONTROLLER_V2_ADDRESS = config.get('CONTROLLER_V2_CONTRACT_ADDRESS', '')

const MintNameWithCryptoModalHOC = (props: Props) => {
  const {
    name: modalName,
    isMintingName,
    isMintingNameCrossChain,
    metadata: { name },
    isLoadingAuthorization,
    getContract,
    onAuthorizedAction,
    onClaimName,
    onClaimNameCrossChain,
    onOpenFatFingerModal,
    onCloseFatFingerModal,
    onClose
  } = props

  const onBuyNatively = useCallback(() => {
    const contractNames = getContractNames()

    const mana = getContract({
      name: contractNames.MANA,
      network: Network.ETHEREUM
    }) as DCLContract

    const manaContract: Contract = {
      name: ContractName.MANAToken,
      address: mana.address,
      chainId: getChainIdByNetwork(Network.ETHEREUM),
      network: Network.ETHEREUM,
      category: NFTCategory.ENS
    }

    onAuthorizedAction({
      authorizedAddress: CONTROLLER_V2_ADDRESS,
      authorizedContractLabel: 'DCLControllerV2',
      targetContract: manaContract,
      targetContractName: ContractName.MANAToken,
      requiredAllowanceInWei: PRICE_IN_WEI,
      authorizationType: AuthorizationType.ALLOWANCE,
      onAuthorized: () => onClaimName(name)
    })
  }, [name, getContract, onAuthorizedAction, onClaimName])

  const onGetCrossChainRoute: OnGetCrossChainRoute = useCallback(
    (selectedToken, selectedChain, providerTokens, crossChainProvider, wallet) =>
      useCrossChainNameMintingRoute(
        name,
        PRICE_IN_WEI,
        getChainIdByNetwork(Network.ETHEREUM),
        selectedToken,
        selectedChain,
        providerTokens,
        crossChainProvider,
        wallet
      ),
    [name]
  )

  const onGetGasCost: OnGetGasCost = useCallback(
    (selectedToken, chainNativeToken, wallet) => useNameMintingGasCost(name, selectedToken, chainNativeToken, wallet),
    [name]
  )

  const onGoBack = useCallback(() => {
    onClose()
    onOpenFatFingerModal()
  }, [onOpenFatFingerModal, onClose])

  const onCloseModal = useCallback(() => {
    onCloseFatFingerModal()
    return onClose()
  }, [onClose])

  // Emulates a NFT for the item to be minted so it can be shown in the modal
  const asset: NFT = useMemo(
    () => ({
      chainId: getChainIdByNetwork(Network.ETHEREUM),
      network: Network.ETHEREUM,
      name,
      data: {
        ens: { subdomain: name }
      },
      category: NFTCategory.ENS,
      updatedAt: Date.now(),
      id: '1',
      itemId: '1',
      tokenId: '1',
      owner: '0x0',
      vendor: VendorName.DECENTRALAND,
      activeOrderId: null,
      openRentalId: null,
      image: '',
      url: '',
      issuedId: '1',
      createdAt: Date.now(),
      soldAt: Date.now(),
      price: PRICE_IN_WEI,
      contractAddress: CONTROLLER_V2_ADDRESS
    }),
    [name]
  )

  return (
    <BuyWithCryptoModal
      price={PRICE_IN_WEI}
      isBuyingAsset={isMintingName || isMintingNameCrossChain}
      onBuyNatively={onBuyNatively}
      onBuyCrossChain={onClaimNameCrossChain}
      onGetGasCost={onGetGasCost}
      isLoadingAuthorization={isLoadingAuthorization}
      onGetCrossChainRoute={onGetCrossChainRoute}
      metadata={{ asset }}
      name={modalName}
      onGoBack={onGoBack}
      onClose={onCloseModal}
    />
  )
}

export const MintNameWithCryptoModal = React.memo(
  withAuthorizedAction(
    MintNameWithCryptoModalHOC,
    AuthorizedAction.CLAIM_NAME,
    {
      action: 'names_page.claim_name_fat_finger_modal.authorization.action',
      title_action: 'names_page.claim_name_fat_finger_modal.authorization.title_action'
    },
    getClaimNameStatus,
    getErrorMessage
  )
)
