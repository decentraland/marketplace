import { ChainId, Network } from '@dcl/schemas'
import { RetryParams } from 'decentraland-dapps/dist/lib/api'
import { ContractData, ContractName, getContract } from 'decentraland-transactions'

export function getERC721ContractData(data: { contractAddress: string; network: Network; chainId: ChainId }) {
  const contract: ContractData =
    /*  We need to use the ERC721CollectionV2 instead of ERC721 for non-ethereum transfers otherwise 
        the meta-tx would fail due to wrong domain and version.
        If some day we have other types of NFTs other than ERC721CollectionV2 we will need to handle them appropiately too.
      */
    data.network !== Network.ETHEREUM
      ? {
          ...getContract(ContractName.ERC721CollectionV2, data.chainId),
          address: data.contractAddress
        }
      : {
          ...getContract(ContractName.ERC721, data.chainId),
          address: data.contractAddress
        }
  return contract
}

export const retryParams: RetryParams = {
  attempts: 3,
  delay: 1500
}
