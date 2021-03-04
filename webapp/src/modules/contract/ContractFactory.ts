import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { ContractOptions } from 'web3x-es/contract'
import { getConnectedProvider } from 'decentraland-dapps/dist/lib/eth'

type ContractConstructor<T> = {
  new (eth: Eth, address?: Address, options?: ContractOptions): T
}

export class ContractFactory {
  static async build<T>(Contract: ContractConstructor<T>, address: string) {
    const provider = await getConnectedProvider()
    if (!provider) {
      throw new Error('Could not connect to provider')
    }

    const eth = new Eth(provider)

    if (!address) {
      throw new Error(`Empty address for contract ${Contract.constructor.name}`)
    }

    return new Contract(eth, Address.fromString(address))
  }
}
