import { ContractService as ContractServiceInterface } from '../services'
import { NFTCategory } from '../../nft/types'

const env = process.env

const SuperRare = env.REACT_APP_SUPER_RARE_ADDRESS!
const SuperRareV2 = env.REACT_APP_SUPER_RARE_V2_ADDRESS!

const contractAddresses = {
  SuperRare,
  SuperRareV2
} as const

export type ContractName = keyof typeof contractAddresses

export class ContractService implements ContractServiceInterface {
  static contractAddresses = contractAddresses

  contractAddresses = contractAddresses

  contractSymbols = {
    [SuperRare]: 'SR',
    [SuperRareV2]: 'SR'
  }

  contractNames = {
    [SuperRare]: 'SuperRare',
    [SuperRareV2]: 'SuperRareV2'
  } as const

  contractCategories = {
    [SuperRare]: NFTCategory.PICTURE_FRAME,
    [SuperRareV2]: NFTCategory.PICTURE_FRAME
  } as const
}
