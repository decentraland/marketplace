import { NFTCategory } from '../nft/types'

const env = process.env

const MANAToken = env.REACT_APP_MANA_ADDRESS!
const LANDRegistry = env.REACT_APP_LAND_ADDRESS!
const EstateRegistry = env.REACT_APP_ESTATE_ADDRESS!
const DCLRegistrar = env.REACT_APP_DCL_REGISTRAR!

const CommunityContestCollection = env.REACT_APP_COMMUNITY_CONTEST_ADDRESS!
const DappCraftMoonminerCollection = env.REACT_APP_DAPP_CRAFT_MOONMINER_ADDRESS!
const DCGCollection = env.REACT_APP_DCG_ADDRESS!
const DCLLaunchCollection = env.REACT_APP_DCL_LAUNCH_ADDRESS!
const DGSummer2020Collection = env.REACT_APP_DG_SUMMER_2020_ADDRESS!
const DgtbleHeadspaceCollection = env.REACT_APP_DGTBLE_HEADSPACE_ADDRESS!
const ExclusiveMasksCollection = env.REACT_APP_EXCLUSIVE_MASKS_ADDRESS!
const Halloween2019Collection = env.REACT_APP_HALLOWEEN_2019_ADDRESS!
const MCHCollection = env.REACT_APP_MCH_ADDRESS!
const Moonshot2020Collection = env.REACT_APP_MOONSHOT_2020_ADDRESS!
const StaySafeCollection = env.REACT_APP_DCL_STAY_SAFE_ADDRESS!
const PMOUttathisworldCollection = env.REACT_APP_PMO_UTTATHISWORLD_ADDRESS!
const WonderzoneMeteorchaserCollection = env.REACT_APP_WONDERZONE_METEORCHASER_ADDRESS!
const Xmas2019Collection = env.REACT_APP_XMAS_2019_ADDRESS!

const Marketplace = env.REACT_APP_MARKETPLACE_ADDRESS!
const Bids = env.REACT_APP_BIDS_ADDRESS!

export const contractAddresses = {
  MANAToken,
  LANDRegistry,
  EstateRegistry,
  DCLRegistrar,
  CommunityContestCollection,
  DappCraftMoonminerCollection,
  DCGCollection,
  DCLLaunchCollection,
  ExclusiveMasksCollection,
  Halloween2019Collection,
  MCHCollection,
  Moonshot2020Collection,
  StaySafeCollection,
  Xmas2019Collection,
  DGSummer2020Collection,
  DgtbleHeadspaceCollection,
  PMOUttathisworldCollection,
  WonderzoneMeteorchaserCollection,
  Marketplace,
  Bids
}

export const contractSymbols = {
  [MANAToken]: 'MANA',
  [LANDRegistry]: 'LAND',
  [EstateRegistry]: 'Estates',
  [DCLRegistrar]: 'Names',
  [CommunityContestCollection]: 'Community Contest',
  [DappCraftMoonminerCollection]: 'Dapp Craft Moon Miner',
  [DCGCollection]: 'DCG',
  [DCLLaunchCollection]: 'DCL Launch',
  [DGSummer2020Collection]: 'DG Summer',
  [DgtbleHeadspaceCollection]: 'Dgtble Headspace',
  [ExclusiveMasksCollection]: 'Exclusive Masks',
  [Halloween2019Collection]: 'Halloween',
  [MCHCollection]: 'MCH',
  [Moonshot2020Collection]: 'Moonshot',
  [PMOUttathisworldCollection]: 'PMO Uttathisworld',
  [StaySafeCollection]: 'Stay Safe',
  [WonderzoneMeteorchaserCollection]: 'Wonderzone Meteorcharser',
  [Xmas2019Collection]: 'Xmas',
  [Marketplace]: 'Marketplace',
  [Bids]: 'Bids'
} as const

export const contractCategories = {
  [LANDRegistry]: NFTCategory.PARCEL,
  [EstateRegistry]: NFTCategory.ESTATE,
  [DCLRegistrar]: NFTCategory.ENS,
  [CommunityContestCollection]: NFTCategory.WEARABLE,
  [DappCraftMoonminerCollection]: NFTCategory.WEARABLE,
  [DCGCollection]: NFTCategory.WEARABLE,
  [DCLLaunchCollection]: NFTCategory.WEARABLE,
  [DGSummer2020Collection]: NFTCategory.WEARABLE,
  [DgtbleHeadspaceCollection]: NFTCategory.WEARABLE,
  [ExclusiveMasksCollection]: NFTCategory.WEARABLE,
  [Halloween2019Collection]: NFTCategory.WEARABLE,
  [MCHCollection]: NFTCategory.WEARABLE,
  [Moonshot2020Collection]: NFTCategory.WEARABLE,
  [PMOUttathisworldCollection]: NFTCategory.WEARABLE,
  [StaySafeCollection]: NFTCategory.WEARABLE,
  [WonderzoneMeteorchaserCollection]: NFTCategory.WEARABLE,
  [Xmas2019Collection]: NFTCategory.WEARABLE
} as const

export const contractNames = {
  [MANAToken]: 'MANAToken',
  [LANDRegistry]: 'LANDRegistry',
  [EstateRegistry]: 'EstateRegistry',
  [DCLRegistrar]: 'DCLRegistrar',
  [CommunityContestCollection]: 'CommunityContestCollection',
  [DappCraftMoonminerCollection]: 'DappCraftMoonminerCollection',
  [DCGCollection]: 'DCGCollection',
  [DCLLaunchCollection]: 'DCLLaunchCollection',
  [DGSummer2020Collection]: 'DGSummer2020Collection',
  [DgtbleHeadspaceCollection]: 'DgtbleHeadspaceCollection',
  [ExclusiveMasksCollection]: 'ExclusiveMasksCollection',
  [Halloween2019Collection]: 'Halloween2019Collection',
  [MCHCollection]: 'MCHCollection',
  [Moonshot2020Collection]: 'Moonshot2020Collection',
  [PMOUttathisworldCollection]: 'PMOUttathisworldCollection',
  [StaySafeCollection]: 'StaySafeCollection',
  [WonderzoneMeteorchaserCollection]: 'WonderzoneMeteorchaserCollection',
  [Xmas2019Collection]: 'Xmas2019Collection',
  [Marketplace]: 'Marketplace',
  [Bids]: 'ERC721Bid'
}
