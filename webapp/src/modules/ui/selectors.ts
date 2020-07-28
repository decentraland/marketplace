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
import { RootState } from '../reducer'
import { View } from './types'
import { BidState } from '../bid/reducer'
import { Bid } from '../bid/types'

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

export const getState = (state: RootState) => state.ui
export const getView = (state: RootState) => getState(state).view

export const getNFTs = createSelector<
  RootState,
  UIState,
  NFTState['data'],
  NFT[]
>(getState, getNFTData, (ui, nftsById) => ui.nftIds.map(id => nftsById[id]))

export const getHomepageWearables = createGetNFTsSelector(
  ui => ui.homepageWearableIds
)
export const getHomepageLand = createGetNFTsSelector(ui => ui.homepageLandIds)
export const getHomepageENS = createGetNFTsSelector(ui => ui.homepageENSIds)
export const getPartnersSuperRare = createGetNFTsSelector(
  ui => ui.partnersSuperRareIds
)
export const getPartnersMakersPlace = createGetNFTsSelector(
  ui => ui.partnersMakersPlaceIds
)

export const isHomepageWearablesLoading = createNFTsLoadingSelector(
  View.HOME_WEARABLES
)
export const isHomepageENSLoading = createNFTsLoadingSelector(View.HOME_LAND)
export const isHomepageLandLoading = createNFTsLoadingSelector(View.HOME_ENS)
export const isPartnersSuperRareLoading = createNFTsLoadingSelector(
  View.PARTNERS_SUPER_RARE
)
export const isPartnersMakersPlaceLoading = createNFTsLoadingSelector(
  View.PARTNERS_MAKERS_PLACE
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
