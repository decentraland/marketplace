import { ContractService as ContractServiceInterface } from '../services'
import { Network } from '../../contract/types'
import { TransferType } from '../types'
import { NFTCategory } from './nft/types'

const network = process.env.REACT_APP_NETWORK! as Network

const contractAddresses = {
  [Network.ROPSTEN]: {
    MANAToken: '0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb',
    LANDRegistry: '0x7a73483784ab79257bb11b96fd62a2c3ae4fb75b',
    EstateRegistry: '0x124bf28a423b2ca80b3846c3aa0eb944fe7ebb95',
    Marketplace: '0x5424912699dabaa5f2998750c1c66e73d67ad219',
    Bids: '0x250fa138c0a994799c7a49df3097dc71e37b3d6f',
    DCLRegistrar: '0xeb6f5d94d79f0750781cc962908b161b95192f53',
    CommunityContestCollection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    DappcraftMoonminerCollection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    DCGCollection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    DCLLaunchCollection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    DGSummer2020Collection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    DgtbleHeadspaceCollection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    ExclusiveMasksCollection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    Halloween2019Collection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    MCHCollection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    Moonshot2020Collection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    PMOuttathisworldCollection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    StaySafeCollection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    WonderzoneMeteorchaserCollection:
      '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0',
    Xmas2019Collection: '0x30ae57840b0e9b8ea55334083d53d80b2cfe80e0'
  },
  [Network.MAINNET]: {
    MANAToken: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    LANDRegistry: '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d',
    EstateRegistry: '0x959e104e1a4db6317fa58f8295f586e1a978c297',
    Marketplace: '0x8e5660b4ab70168b5a6feea0e0315cb49c8cd539',
    Bids: '0xe479dfd9664c693b2e2992300930b00bfde08233',
    DCLRegistrar: '0x2a187453064356c898cae034eaed119e1663acb8',
    CommunityContestCollection: '0x32b7495895264ac9d0b12d32afd435453458b1c6',
    DappcraftMoonminerCollection: '0x1e1d4e6262787c8a8783a37fee698bd42aa42bec',
    DCGCollection: '0x3163d2cfee3183f9874e2869942cc62649eeb004',
    DCLLaunchCollection: '0xd35147be6401dcb20811f2104c33de8e97ed6818',
    DGSummer2020Collection: '0xbf53c33235cbfc22cef5a61a83484b86342679c5',
    DgtbleHeadspaceCollection: '0x574f64ac2e7215cba9752b85fc73030f35166bc0',
    ExclusiveMasksCollection: '0xc04528c14c8ffd84c7c1fb6719b4a89853035cdd',
    Halloween2019Collection: '0xc1f4b0eea2bd6690930e6c66efd3e197d620b9c2',
    MCHCollection: '0xf64dc33a192e056bb5f0e5049356a0498b502d50',
    Moonshot2020Collection: '0x6a99abebb48819d2abe92c5e4dc4f48dc09a3ee8',
    PMOuttathisworldCollection: '0x75a3752579dc2d63ca229eebbe3537fbabf85a12',
    StaySafeCollection: '0x201c3af8c471e5842428b74d1e7c0249adda2a92',
    WonderzoneMeteorchaserCollection:
      '0x34ed0aa248f60f54dd32fbc9883d6137a491f4f3',
    Xmas2019Collection: '0xc3af02c0fd486c8e9da5788b915d6fff3f049866'
  }
}[network]

const {
  MANAToken,
  LANDRegistry,
  EstateRegistry,
  Marketplace,
  Bids,
  DCLRegistrar,
  CommunityContestCollection,
  DappcraftMoonminerCollection,
  DCGCollection,
  DCLLaunchCollection,
  DGSummer2020Collection,
  DgtbleHeadspaceCollection,
  ExclusiveMasksCollection,
  Halloween2019Collection,
  MCHCollection,
  Moonshot2020Collection,
  PMOuttathisworldCollection,
  StaySafeCollection,
  WonderzoneMeteorchaserCollection,
  Xmas2019Collection
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
    [DCLRegistrar]: 'Names',
    [CommunityContestCollection]: 'Community Contest',
    [DappcraftMoonminerCollection]: 'Dappcraft Moonminer',
    [DCGCollection]: 'DCG',
    [DCLLaunchCollection]: 'DCL Launch',
    [DGSummer2020Collection]: 'DG Summer',
    [DgtbleHeadspaceCollection]: 'Dgtble Headspace',
    [ExclusiveMasksCollection]: 'Exclusive Masks',
    [Halloween2019Collection]: 'Halloween',
    [MCHCollection]: 'MCH',
    [Moonshot2020Collection]: 'Moonshot',
    [PMOuttathisworldCollection]: 'PMO Uttathisworld',
    [StaySafeCollection]: 'Stay Safe',
    [WonderzoneMeteorchaserCollection]: 'Wonderzone Meteorcharser',
    [Xmas2019Collection]: 'Xmas'
  } as const

  contractNames = {
    [MANAToken]: 'MANAToken',
    [LANDRegistry]: 'LANDRegistry',
    [EstateRegistry]: 'EstateRegistry',
    [DCLRegistrar]: 'DCLRegistrar',
    [Marketplace]: 'Marketplace',
    [Bids]: 'ERC721Bid',
    [CommunityContestCollection]: 'CommunityContestCollection',
    [DappcraftMoonminerCollection]: 'DappcraftMoonminerCollection',
    [DCGCollection]: 'DCGCollection',
    [DCLLaunchCollection]: 'DCLLaunchCollection',
    [DGSummer2020Collection]: 'DGSummer2020Collection',
    [DgtbleHeadspaceCollection]: 'DgtbleHeadspaceCollection',
    [ExclusiveMasksCollection]: 'ExclusiveMasksCollection',
    [Halloween2019Collection]: 'Halloween2019Collection',
    [MCHCollection]: 'MCHCollection',
    [Moonshot2020Collection]: 'Moonshot2020Collection',
    [PMOuttathisworldCollection]: 'PMOuttathisworldCollection',
    [StaySafeCollection]: 'StaySafeCollection',
    [WonderzoneMeteorchaserCollection]: 'WonderzoneMeteorchaserCollection',
    [Xmas2019Collection]: 'Xmas2019Collection'
  } as const

  contractCategories = {
    [LANDRegistry]: NFTCategory.PARCEL,
    [EstateRegistry]: NFTCategory.ESTATE,
    [DCLRegistrar]: NFTCategory.ENS,
    [CommunityContestCollection]: NFTCategory.WEARABLE,
    [DappcraftMoonminerCollection]: NFTCategory.WEARABLE,
    [DCGCollection]: NFTCategory.WEARABLE,
    [DCLLaunchCollection]: NFTCategory.WEARABLE,
    [DGSummer2020Collection]: NFTCategory.WEARABLE,
    [DgtbleHeadspaceCollection]: NFTCategory.WEARABLE,
    [ExclusiveMasksCollection]: NFTCategory.WEARABLE,
    [Halloween2019Collection]: NFTCategory.WEARABLE,
    [MCHCollection]: NFTCategory.WEARABLE,
    [Moonshot2020Collection]: NFTCategory.WEARABLE,
    [PMOuttathisworldCollection]: NFTCategory.WEARABLE,
    [StaySafeCollection]: NFTCategory.WEARABLE,
    [WonderzoneMeteorchaserCollection]: NFTCategory.WEARABLE,
    [Xmas2019Collection]: NFTCategory.WEARABLE
  } as const

  getTransferType(_address: string) {
    return TransferType.SAFE_TRANSFER_FROM
  }
}
