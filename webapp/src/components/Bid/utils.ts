import { ethers } from 'ethers'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib'
import ERC721ABI from '../../contracts/ERC721.json'
import { Contract } from '../../modules/vendor/services'

export const fetchContractName = async (contract: Contract | null) => {
  try {
    if (!contract) {
      return null
    }

    const provider = await getNetworkProvider(contract.chainId)

    const erc721 = new ethers.Contract(contract.address, ERC721ABI, new ethers.providers.Web3Provider(provider))

    return (await erc721.name()) as string
  } catch (e) {
    return null
  }
}
