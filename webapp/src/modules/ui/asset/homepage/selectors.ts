import { AnyAction } from 'redux'
import { createSelector } from 'reselect'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'

import { NFTState } from '../../../nft/reducer'
import { ItemState } from '../../../item/reducer'
import { FETCH_NFTS_REQUEST, FetchNFTsRequestAction } from '../../../nft/actions'
import { FETCH_ITEMS_REQUEST, FETCH_TRENDING_ITEMS_REQUEST, FetchItemsRequestAction } from '../../../item/actions'
import { getData as getNFTData, getLoading as getNFTLoading } from '../../../nft/selectors'
import { getData as getItemData, getLoading as getItemLoading } from '../../../item/selectors'
import { Asset } from '../../../asset/types'
import { RootState } from '../../../reducer'
import { View } from '../../types'
import { HomepageView } from './types'
import { HomepageUIState } from './reducer'

const isFetchNftsRequestAction = (action: AnyAction): action is FetchNFTsRequestAction => action.type === FETCH_NFTS_REQUEST
const isFetchItemsRequestAction = (action: AnyAction): action is FetchItemsRequestAction => action.type === FETCH_ITEMS_REQUEST
const isFetchTrendingItemsRequestAction = (action: AnyAction): action is FetchItemsRequestAction =>
  action.type === FETCH_TRENDING_ITEMS_REQUEST

export const getState = (state: RootState) => state.ui.asset.homepage

export const getHomepage = createSelector<RootState, HomepageUIState, NFTState['data'], ItemState['data'], Record<HomepageView, Asset[]>>(
  getState,
  getNFTData,
  getItemData,
  (homepage, nftsById, itemsById) => {
    const result: Record<string, Asset[]> = {}

    let view: HomepageView
    for (view in homepage) {
      result[view] = homepage[view].map(id => nftsById[id] || itemsById[id])
    }

    return result as Record<HomepageView, Asset[]>
  }
)

export const getHomepageLoading = createSelector<RootState, HomepageUIState, LoadingState, LoadingState, Record<HomepageView, boolean>>(
  getState,
  getNFTLoading,
  getItemLoading,
  (homepage, nftLoading, itemLoading) => {
    const result: Record<string, boolean> = {}

    for (const view in homepage) {
      result[view] = nftLoading.concat(itemLoading).some(action => {
        return (
          (isFetchNftsRequestAction(action) && action.payload.options.view === view) ||
          (isFetchItemsRequestAction(action) && action.payload.view === view) ||
          (isFetchTrendingItemsRequestAction(action) && view === View.HOME_TRENDING_ITEMS)
        )
      })
    }

    return result as Record<HomepageView, boolean>
  }
)
