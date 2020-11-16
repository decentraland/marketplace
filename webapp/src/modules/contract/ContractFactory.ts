import { Eth } from 'web3x-es/eth'
import { Address } from 'web3x-es/address'
import { ContractOptions } from 'web3x-es/contract'
import { createEth } from 'decentraland-dapps/dist/lib/eth'

type ContractConstructor<T> = {
  new (eth: Eth, address?: Address, options?: ContractOptions): T
}

export class ContractFactory {
  static async build<T>(Contract: ContractConstructor<T>, address: string) {
    const eth = await createEth()
    if (!eth) {
      throw new Error('Could not connect to Ethereum')
    }

    if (!address) {
      throw new Error(`Empty address for contract ${Contract.constructor.name}`)
    }

    return new Contract(eth, Address.fromString(address))
  }
}
