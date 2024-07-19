import { ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib'
import ERC721ABI from '../../contracts/ERC721.json'

export const fetchContractName = async (address: string, chainId: ChainId) => {
  try {
    if (!address || !chainId) {
      return null
    }

    const provider = await getNetworkProvider(chainId)

    const erc721 = new ethers.Contract(address, ERC721ABI, new ethers.providers.Web3Provider(provider))

    return (await erc721.name()) as string
  } catch (e) {
    return null
  }
}
