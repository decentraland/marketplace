import { createSelector } from 'reselect'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'

import { NFTState } from '../../../nft/reducer'
import { FETCH_NFTS_REQUEST } from '../../../nft/actions'
import { NFT } from '../../../nft/types'
import {
  getData as getNFTData,
  getLoading as getNFTLoading
} from '../../../nft/selectors'
import { RootState } from '../../../reducer'
import { HomepageView } from './types'
import { HomepageUIState } from './reducer'

export const getState = (state: RootState) => state.ui.nft.homepage

export const getHomepage = createSelector<
  RootState,
  HomepageUIState,
  NFTState['data'],
  Record<HomepageView, NFT[]>
>(getState, getNFTData, (homepage, nftsById) => {
  const result: Record<string, NFT[]> = {}

  let view: HomepageView
  for (view in homepage) {
    result[view] = homepage[view].map(id => nftsById[id])
  }

  return result as Record<HomepageView, NFT[]>
})

export const getHomepageLoading = createSelector<
  RootState,
  HomepageUIState,
  LoadingState,
  Record<HomepageView, boolean>
>(getState, getNFTLoading, (homepage, nftLoading) => {
  const result: Record<string, boolean> = {}

  for (const view in homepage) {
    result[view] = nftLoading.some(
      action =>
        action.type === FETCH_NFTS_REQUEST &&
        action.payload.options.view === view
    )
  }

  return result as Record<HomepageView, boolean>
})
