import { ContractService as ContractServiceInterface } from '../services'
import { Network } from '../../contract/types'
import { NFTCategory } from '../../nft/types'
import { TransferType } from '../types'

const network = process.env.REACT_APP_NETWORK! as Network

const contractAddresses = {
  [Network.ROPSTEN]: {
    MANAToken: '0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb',
    LANDRegistry: '0x7a73483784ab79257bb11b96fd62a2c3ae4fb75b',
    EstateRegistry: '0x124bf28a423b2ca80b3846c3aa0eb944fe7ebb95',
    Marketplace: '0x5424912699dabaa5f2998750c1c66e73d67ad219',
    Bids: '0x250fa138c0a994799c7a49df3097dc71e37b3d6f',
    DCLRegistrar: '0xeb6f5d94d79f0750781cc962908b161b95192f53'
  },
  [Network.MAINNET]: {
    MANAToken: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    LANDRegistry: '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d',
    EstateRegistry: '0x959e104e1a4db6317fa58f8295f586e1a978c297',
    Marketplace: '0x8e5660b4ab70168b5a6feea0e0315cb49c8cd539',
    Bids: '0xe479dfd9664c693b2e2992300930b00bfde08233',
    DCLRegistrar: '0x2a187453064356c898cae034eaed119e1663acb8'
  }
}[network]

const {
  MANAToken,
  LANDRegistry,
  EstateRegistry,
  Marketplace,
  Bids,
  DCLRegistrar
} = contractAddresses

export type ContractName = keyof typeof contractAddresses

export class ContractService implements ContractServiceInterface {
  static contractAddresses = contractAddresses

  contractAddresses = contractAddresses

  contractSymbols = {
    [MANAToken]: 'MANA',
    [LANDRegistry]: 'LAND',
    [EstateRegistry]: 'Estates',
    [Marketplace]: 'Marketplace',
    [Bids]: 'Bids',
    [DCLRegistrar]: 'Names'
  } as const

  contractNames = {
    [MANAToken]: 'MANAToken',
    [LANDRegistry]: 'LANDRegistry',
    [EstateRegistry]: 'EstateRegistry',
    [DCLRegistrar]: 'DCLRegistrar',
    [Marketplace]: 'Marketplace',
    [Bids]: 'ERC721Bid'
  } as const

  contractCategories = {
    [LANDRegistry]: NFTCategory.PARCEL,
    [EstateRegistry]: NFTCategory.ESTATE,
    [DCLRegistrar]: NFTCategory.ENS
  } as const

  getTransferType(_address: string) {
    return TransferType.SAFE_TRANSFER_FROM
  }
}
