import { createSelector } from 'reselect'
import { LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'

import { NFTState } from '../../../nft/reducer'
import { FETCH_NFTS_REQUEST } from '../../../nft/actions'
import { NFT } from '../../../nft/types'
import { VendorName } from '../../../vendor/types'
import {
  getData as getNFTData,
  getLoading as getNFTLoading
} from '../../../nft/selectors'
import { getPartners as getAllPartners } from '../../../vendor/utils'
import { RootState } from '../../../reducer'
import { PartnerView } from './types'
import { PartnerUIState } from './reducer'

export const getState = (state: RootState) => state.ui.nft.partner

export const getPartners = createSelector<
  RootState,
  PartnerUIState,
  NFTState['data'],
  Record<VendorName, NFT[]>
>(getState, getNFTData, (partnerState, nftsById) => {
  const result: Record<string, NFT[]> = {}

  for (const partner of getAllPartners()) {
    result[partner] = partnerState[partner as PartnerView].map(
      id => nftsById[id]
    )
  }

  return result
})

export const getPartnersLoading = createSelector<
  RootState,
  LoadingState,
  Record<VendorName, boolean>
>(getNFTLoading, nftLoading => {
  const result: Record<string, boolean> = {}

  for (const partner of getAllPartners()) {
    result[partner] = nftLoading.some(
      action =>
        action.type === FETCH_NFTS_REQUEST &&
        action.payload.options.view === partner
    )
  }

  return result
})
