import { createSelector } from 'reselect'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'

import { NFTState } from '../../../nft/reducer'
import { ItemState } from '../../../item/reducer'
import { FETCH_NFTS_REQUEST } from '../../../nft/actions'
import {
  FETCH_ITEMS_REQUEST,
  FETCH_TRENDING_ITEMS_REQUEST
} from '../../../item/actions'
import {
  getData as getNFTData,
  getLoading as getNFTLoading
} from '../../../nft/selectors'
import {
  getData as getItemData,
  getLoading as getItemLoading
} from '../../../item/selectors'
import { Asset } from '../../../asset/types'
import { RootState } from '../../../reducer'
import { View } from '../../types'
import { HomepageView } from './types'
import { HomepageUIState } from './reducer'

export const getState = (state: RootState) => state.ui.asset.homepage

export const getHomepage = createSelector<
  RootState,
  HomepageUIState,
  NFTState['data'],
  ItemState['data'],
  Record<HomepageView, Asset[]>
>(getState, getNFTData, getItemData, (homepage, nftsById, itemsById) => {
  const result: Record<string, Asset[]> = {}

  let view: HomepageView
  for (view in homepage) {
    result[view] = homepage[view].map(id => nftsById[id] || itemsById[id])
  }

  return result as Record<HomepageView, Asset[]>
})

export const getHomepageLoading = createSelector<
  RootState,
  HomepageUIState,
  LoadingState,
  LoadingState,
  Record<HomepageView, boolean>
>(
  getState,
  getNFTLoading,
  getItemLoading,
  (homepage, nftLoading, itemLoading) => {
    const result: Record<string, boolean> = {}

    for (const view in homepage) {
      result[view] = nftLoading.concat(itemLoading).some(action => {
        const { type, payload } = action

        return (
          (type === FETCH_NFTS_REQUEST && payload.options.view === view) ||
          (type === FETCH_ITEMS_REQUEST && payload.view === view) ||
          (type === FETCH_TRENDING_ITEMS_REQUEST &&
            view === View.HOME_TRENDING_ITEMS)
        )
      })
    }

    return result as Record<HomepageView, boolean>
  }
)
