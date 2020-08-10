import { createSelector } from 'reselect'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'

import { NFTState } from '../../../nft/reducer'
import { FETCH_NFTS_REQUEST } from '../../../nft/actions'
import { NFT } from '../../../nft/types'
import { Partner } from '../../../vendor/types'
import {
  getData as getNFTData,
  getLoading as getNFTLoading
} from '../../../nft/selectors'
import { RootState } from '../../../reducer'
import { PartnerUIState } from './reducer'

export const getState = (state: RootState) => state.ui.nft.partner

export const getPartners = createSelector<
  RootState,
  PartnerUIState,
  NFTState['data'],
  Record<Partner, NFT[]>
>(getState, getNFTData, (partnerState, nftsById) => {
  const partners = Object.values(Partner) as Partner[]
  const result: Record<string, NFT[]> = {}

  for (const partner of partners) {
    result[partner] = partnerState[partner].map(id => nftsById[id])
  }

  return result as Record<Partner, NFT[]>
})

export const getPartnersLoading = createSelector<
  RootState,
  LoadingState,
  Record<Partner, boolean>
>(getNFTLoading, nftLoading => {
  const partners = Object.values(Partner) as Partner[]
  const result: Record<string, boolean> = {}

  for (const partner of partners) {
    result[partner] = nftLoading.some(
      action =>
        action.type === FETCH_NFTS_REQUEST &&
        action.payload.options.view === partner
    )
  }

  return result as Record<Partner, boolean>
})
