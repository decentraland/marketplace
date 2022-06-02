import { ContractInterface, ethers, providers } from 'ethers'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'

export class ContractFactory {
  static async build(abi: ContractInterface, address: string) {
    const provider = await getConnectedProvider()
    if (!provider) {
      throw new Error('Could not connect to provider')
    }

    const eth = new providers.Web3Provider(provider)
    const signer = eth.getSigner()

    if (!address) {
      throw new Error('Empty address for contract')
    }

    return new ethers.Contract(address, abi, signer)
  }
}
