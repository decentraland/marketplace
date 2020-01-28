import { NFTCategory } from '../nft/types'
import { contractAddresses } from './addresses'

export type ContractName = keyof typeof contractAddresses

type Contract = {
  name: ContractName
  address: string
}

export type TokenContract = Contract

export type NFTContract = Contract & {
  category: NFTCategory
}
