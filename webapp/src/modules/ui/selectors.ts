import { getSearch } from 'connected-react-router'
import { createSelector } from 'reselect'
import { UIState } from '../ui/reducer'
import { NFTState } from '../nft/reducer'
import { FETCH_NFTS_REQUEST } from '../nft/actions'
import { NFT } from '../nft/types'
import { getData as getBidData } from '../bid/selectors'
import {
  getData as getNFTData,
  getLoading as getNFTLoading
} from '../nft/selectors'
import { SortBy, Section, getParamArray } from '../routing/search'
import { RootState } from '../reducer'
import { View } from './types'
import { BidState } from '../bid/reducer'
import { Bid } from '../bid/types'
import { WearableRarity, WearableGender } from '../nft/wearable/types'
import { ContractName } from '../vendor/types'
import { contractAddresses } from '../contract/utils'

export const getState = (state: RootState) => state.ui
export const getNFTs = createSelector<
  RootState,
  UIState,
  NFTState['data'],
  NFT[]
>(getState, getNFTData, (ui, nftsById) => ui.nftIds.map(id => nftsById[id]))

export const getUIPage = createSelector<RootState, string, number>(
  getSearch,
  search => {
    const page = new URLSearchParams(search).get('page')
    return page === null || isNaN(+page) ? 1 : +page
  }
)

export const getUISection = createSelector<RootState, string, Section>(
  getSearch,
  search => {
    const section = new URLSearchParams(search).get('section')
    if (section && Object.values(Section).includes(section as any)) {
      return section as Section
    }
    return Section.ALL
  }
)

export const getUISortBy = createSelector<RootState, string, SortBy>(
  getSearch,
  search => {
    const sortBy = new URLSearchParams(search).get('sortBy')
    if (sortBy) {
      return sortBy as SortBy
    }
    return SortBy.RECENTLY_LISTED
  }
)

export const getUIOnlyOnSale = createSelector<
  RootState,
  string,
  boolean | undefined
>(getSearch, search => {
  const onlyOnSale = new URLSearchParams(search).get('onlyOnSale')
  return onlyOnSale === null ? undefined : onlyOnSale === 'true'
})

export const getUIWearableRarities = createSelector<
  RootState,
  string,
  WearableRarity[]
>(getSearch, search =>
  getParamArray<WearableRarity>(
    search,
    'rarities',
    Object.values(WearableRarity)
  )
)

export const getUIWearableGenders = createSelector<
  RootState,
  string,
  WearableGender[]
>(getSearch, search =>
  getParamArray<WearableGender>(
    search,
    'genders',
    Object.values(WearableGender)
  )
)

export const getUIContracts = createSelector<RootState, string, ContractName[]>(
  getSearch,
  search =>
    getParamArray<ContractName>(
      search,
      'contracts',
      Object.keys(contractAddresses)
    )
)

export const getUISearch = createSelector<RootState, string, string>(
  getSearch,
  search => new URLSearchParams(search).get('search') || ''
)

const createGetNFTsSelector = (combiner: (ui: UIState) => string[]) =>
  createSelector<RootState, UIState, NFTState['data'], NFT[]>(
    getState,
    getNFTData,
    (ui, nftsById) => combiner(ui).map(id => nftsById[id])
  )
const createNFTsLoadingSelector = (view: View) => (state: RootState) =>
  getNFTLoading(state).some(
    action =>
      action.type === FETCH_NFTS_REQUEST && action.payload.options.view === view
  )

export const getHomepageWearables = createGetNFTsSelector(
  ui => ui.homepageWearableIds
)
export const getHomepageLand = createGetNFTsSelector(ui => ui.homepageLandIds)
export const getHomepageENS = createGetNFTsSelector(ui => ui.homepageENSIds)
export const getPartnersSuperRare = createGetNFTsSelector(
  ui => ui.partnersSuperRareIds
)

export const isHomepageWearablesLoading = createNFTsLoadingSelector(
  View.HOME_WEARABLES
)
export const isHomepageENSLoading = createNFTsLoadingSelector(View.HOME_LAND)
export const isHomepageLandLoading = createNFTsLoadingSelector(View.HOME_ENS)
export const isPartnersSuperRareLoading = createNFTsLoadingSelector(
  View.PARTNERS_SUPER_RARE
)

export const getSellerBids = createSelector<
  RootState,
  UIState,
  BidState['data'],
  Bid[]
>(getState, getBidData, (ui, bidsById) =>
  ui.sellerBidIds.map(id => bidsById[id])
)

export const getBidderBids = createSelector<
  RootState,
  UIState,
  BidState['data'],
  Bid[]
>(getState, getBidData, (ui, bidsById) =>
  ui.bidderBidIds.map(id => bidsById[id])
)

export const getArchivedBidIds = (state: RootState) =>
  getState(state).archivedBidIds

export const getNFTBids = createSelector<
  RootState,
  UIState,
  BidState['data'],
  Bid[]
>(getState, getBidData, (ui, bidsById) => ui.nftBidIds.map(id => bidsById[id]))

export const getAssetsCount = (state: RootState) => getState(state).assetCount
