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
import { PartnerView } from './types'
import { PartnerUIState } from './reducer'

export const getState = (state: RootState) => state.ui.nft.partner

export const getPartners = createSelector<
  RootState,
  PartnerUIState,
  NFTState['data'],
  Record<PartnerView, NFT[]>
>(getState, getNFTData, (partner, nftsById) => {
  const result: Record<string, NFT[]> = {}

  let view: PartnerView
  for (view in partner) {
    result[view] = partner[view].map(id => nftsById[id])
  }

  return result as Record<PartnerView, NFT[]>
})

export const getPartnersLoading = createSelector<
  RootState,
  PartnerUIState,
  LoadingState,
  Record<PartnerView, boolean>
>(getState, getNFTLoading, (partner, nftLoading) => {
  const result: Record<string, boolean> = {}

  for (const view in partner) {
    result[view] = nftLoading.some(
      action =>
        action.type === FETCH_NFTS_REQUEST &&
        action.payload.options.view === view
    )
  }

  return result as Record<PartnerView, boolean>
})
