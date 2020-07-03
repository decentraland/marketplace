import { NFTCategory } from '../nft/types'

const env = process.env

const MANAToken = env.REACT_APP_MANA_ADDRESS!
const LANDRegistry = env.REACT_APP_LAND_ADDRESS!
const EstateRegistry = env.REACT_APP_ESTATE_ADDRESS!
const DCLRegistrar = env.REACT_APP_DCL_REGISTRAR!

const CommunityContestCollection = env.REACT_APP_COMMUNITY_CONTEST_ADDRESS!
const DCGCollection = env.REACT_APP_DCG_ADDRESS!
const DCLLaunchCollection = env.REACT_APP_DCL_LAUNCH_ADDRESS!
const ExclusiveMasksCollection = env.REACT_APP_EXCLUSIVE_MASKS_ADDRESS!
const Halloween2019Collection = env.REACT_APP_HALLOWEEN_2019_ADDRESS!
const MCHCollection = env.REACT_APP_MCH_ADDRESS!
const Moonshot2020Collection = env.REACT_APP_MOONSHOT_2020_ADDRESS!
const StaySafeCollection = env.REACT_APP_DCL_STAY_SAFE_ADDRESS!
const Xmas2019Collection = env.REACT_APP_XMAS_2019_ADDRESS!

const Marketplace = env.REACT_APP_MARKETPLACE_ADDRESS!
const Bids = env.REACT_APP_BIDS_ADDRESS!

export const contractAddresses = {
  MANAToken,
  LANDRegistry,
  EstateRegistry,
  DCLRegistrar,
  CommunityContestCollection,
  DCGCollection,
  DCLLaunchCollection,
  ExclusiveMasksCollection,
  Halloween2019Collection,
  MCHCollection,
  Moonshot2020Collection,
  StaySafeCollection,
  Xmas2019Collection,
  Marketplace,
  Bids
}

export const contractSymbols = {
  [MANAToken]: 'MANA',
  [LANDRegistry]: 'LAND',
  [EstateRegistry]: 'Estates',
  [DCLRegistrar]: 'Names',
  [CommunityContestCollection]: 'Community Contest',
  [DCGCollection]: 'DCG',
  [DCLLaunchCollection]: 'DCL Launch',
  [ExclusiveMasksCollection]: 'Exclusive Masks',
  [Halloween2019Collection]: 'Halloween',
  [MCHCollection]: 'MCH',
  [Moonshot2020Collection]: 'Moonshot',
  [StaySafeCollection]: 'Stay Safe',
  [Xmas2019Collection]: 'Xmas',
  [Marketplace]: 'Marketplace',
  [Bids]: 'Bids'
} as const

export const contractCategories = {
  [LANDRegistry]: NFTCategory.PARCEL,
  [EstateRegistry]: NFTCategory.ESTATE,
  [DCLRegistrar]: NFTCategory.ENS,
  [CommunityContestCollection]: NFTCategory.WEARABLE,
  [DCGCollection]: NFTCategory.WEARABLE,
  [DCLLaunchCollection]: NFTCategory.WEARABLE,
  [ExclusiveMasksCollection]: NFTCategory.WEARABLE,
  [Halloween2019Collection]: NFTCategory.WEARABLE,
  [MCHCollection]: NFTCategory.WEARABLE,
  [Moonshot2020Collection]: NFTCategory.WEARABLE,
  [StaySafeCollection]: NFTCategory.WEARABLE,
  [Xmas2019Collection]: NFTCategory.WEARABLE
} as const

export const contractNames = {
  [MANAToken]: 'MANAToken',
  [LANDRegistry]: 'LANDRegistry',
  [EstateRegistry]: 'EstateRegistry',
  [CommunityContestCollection]: 'CommunityContestCollection',
  [DCGCollection]: 'DCGCollection',
  [DCLLaunchCollection]: 'DCLLaunchCollection',
  [DCLRegistrar]: 'DCLRegistrar',
  [ExclusiveMasksCollection]: 'ExclusiveMasksCollection',
  [Halloween2019Collection]: 'Halloween2019Collection',
  [Marketplace]: 'Marketplace',
  [MCHCollection]: 'MCHCollection',
  [Moonshot2020Collection]: 'Moonshot2020Collection',
  [StaySafeCollection]: 'StaySafeCollection',
  [Xmas2019Collection]: 'Xmas2019Collection',
  [Bids]: 'ERC721Bid'
}
