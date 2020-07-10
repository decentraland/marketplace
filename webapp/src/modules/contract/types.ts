import { NFTCategory } from '../vendor/nft/types'
import { ContractName } from '../vendor/types'

type Contract = {
  name: ContractName
  address: string
}

export type TokenContract = Contract

export type NFTContract = Contract & {
  category: NFTCategory
}
