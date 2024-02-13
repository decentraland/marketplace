import { useCallback } from 'react'

export const BuyNFTWithCryptoModal = (props: Props) => {
  const onBuyNatively = useCallback(() => {
    const contractNames = getContractNames()

    const mana = getContractProp({
      name: contractNames.MANA,
      network: asset.network
    }) as DCLContract

    const marketplace = getContractProp({
      address: order?.marketplaceAddress,
      network: asset.network
    }) as DCLContract

    onAuthorizedAction({
      targetContractName: ContractName.MANAToken,
      authorizationType: AuthorizationType.ALLOWANCE,
      authorizedAddress: order.marketplaceAddress,
      targetContract: mana as Contract,
      authorizedContractLabel: marketplace.label || marketplace.name,
      requiredAllowanceInWei: order.price,
      onAuthorized: alreadyAuthorized =>
        onExecuteOrder(order, asset as NFT, undefined, !alreadyAuthorized) // undefined as fingerprint
    })
  }, [asset, order, getContractProp, onAuthorizedAction, onExecuteOrder])
}
