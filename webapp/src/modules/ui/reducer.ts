import {
  FetchNFTsSuccessAction,
  FETCH_NFTS_SUCCESS,
  FetchNFTsRequestAction,
  FETCH_NFTS_REQUEST
} from '../nft/actions'
import {
  FETCH_BIDS_BY_NFT_SUCCESS,
  FETCH_BIDS_BY_ADDRESS_SUCCESS,
  ARCHIVE_BID,
  UNARCHIVE_BID,
  FetchBidsByAddressSuccessAction,
  ArchiveBidAction,
  UnarchiveBidAction,
  FetchBidsByNFTSuccessAction
} from '../bid/actions'
import { BROWSE, BrowseAction } from '../routing/actions'
import { SET_VIEW, SetViewAction } from './actions'
import { View } from './types'

export type UIState = {
  view?: View
  nftIds: string[]
  lastTimestamp: number
  homepageWearableIds: string[]
  homepageLandIds: string[]
  homepageENSIds: string[]
  partnersSuperRareIds: string[]
  partnersMakersPlaceIds: string[]
  sellerBidIds: string[]
  bidderBidIds: string[]
  archivedBidIds: string[]
  nftBidIds: string[]
  assetCount?: number
}

const INITIAL_STATE: UIState = {
  view: undefined,
  nftIds: [],
  homepageWearableIds: [],
  homepageLandIds: [],
  homepageENSIds: [],
  partnersSuperRareIds: [],
  partnersMakersPlaceIds: [],
  sellerBidIds: [],
  bidderBidIds: [],
  archivedBidIds: [],
  nftBidIds: [],
  assetCount: undefined,
  lastTimestamp: 0
}

type UIReducerAction =
  | SetViewAction
  | FetchNFTsRequestAction
  | FetchNFTsSuccessAction
  | FetchBidsByAddressSuccessAction
  | FetchBidsByNFTSuccessAction
  | ArchiveBidAction
  | UnarchiveBidAction
  | BrowseAction

export function uiReducer(
  state: UIState = INITIAL_STATE,
  action: UIReducerAction
) {
  switch (action.type) {
    case SET_VIEW: {
      return {
        ...state,
        view: action.payload.view
      }
    }
    case BROWSE: {
      const { view } = action.payload.searchOptions
      return {
        ...state,
        nftIds: view ? [] : state.nftIds
      }
    }
    case FETCH_NFTS_REQUEST: {
      const { view } = action.payload.options
      return {
        ...state,
        nftIds: view === View.LOAD_MORE ? state.nftIds : [],
        assetCount: undefined
      }
    }
    case FETCH_NFTS_SUCCESS: {
      if (action.payload.timestamp < state.lastTimestamp) {
        return state
      }
      const view = action.payload.options.view
      switch (view) {
        case View.MARKET:
        case View.ACCOUNT: {
          return {
            ...state,
            view,
            nftIds: action.payload.nfts.map(nft => nft.id),
            assetCount: action.payload.count,
            timestamp: action.payload.timestamp
          }
        }
        case View.HOME_WEARABLES: {
          return {
            ...state,
            view,
            homepageWearableIds: action.payload.nfts.map(nft => nft.id)
          }
        }
        case View.HOME_LAND: {
          return {
            ...state,
            view,
            homepageLandIds: action.payload.nfts.map(nft => nft.id)
          }
        }
        case View.HOME_ENS: {
          return {
            ...state,
            view,
            homepageENSIds: action.payload.nfts.map(nft => nft.id)
          }
        }
        case View.PARTNERS_SUPER_RARE: {
          return {
            ...state,
            view,
            partnersSuperRareIds: action.payload.nfts.map(nft => nft.id)
          }
        }
        case View.PARTNERS_MAKERS_PLACE: {
          return {
            ...state,
            view,
            partnersMakersPlaceIds: action.payload.nfts.map(nft => nft.id)
          }
        }
        case View.LOAD_MORE: {
          return {
            ...state,
            nftIds: [
              ...state.nftIds,
              ...action.payload.nfts.map(nft => nft.id)
            ],
            assetCount: action.payload.count,
            timestamp: action.payload.timestamp
          }
        }
        default:
          return state
      }
    }
    case FETCH_BIDS_BY_ADDRESS_SUCCESS: {
      const { seller, bidder } = action.payload
      return {
        ...state,
        sellerBidIds: seller.map(bid => bid.id),
        bidderBidIds: bidder.map(bid => bid.id)
      }
    }
    case FETCH_BIDS_BY_NFT_SUCCESS: {
      const { bids } = action.payload
      return {
        ...state,
        nftBidIds: bids.map(bid => bid.id)
      }
    }
    case ARCHIVE_BID: {
      const { bid } = action.payload
      return {
        ...state,
        archivedBidIds: [
          ...state.archivedBidIds.filter(id => id !== bid.id),
          bid.id
        ]
      }
    }
    case UNARCHIVE_BID: {
      const { bid } = action.payload
      return {
        ...state,
        archivedBidIds: [...state.archivedBidIds.filter(id => id !== bid.id)]
      }
    }
    default:
      return state
  }
}
