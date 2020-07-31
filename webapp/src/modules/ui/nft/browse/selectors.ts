import { createSelector } from 'reselect'
import { NFTState } from '../../../nft/reducer'
import { NFT } from '../../../nft/types'
import { getData as getNFTData } from '../../../nft/selectors'
import { RootState } from '../../../reducer'
import { BrowseUIState } from './reducer'

export const getState = (state: RootState) => state.ui.nft.browse
export const getView = (state: RootState) => getState(state).view
export const getAssetsCount = (state: RootState) => getState(state).assetCount

export const getNFTs = createSelector<
  RootState,
  BrowseUIState,
  NFTState['data'],
  NFT[]
>(getState, getNFTData, (browse, nftsById) =>
  browse.nftIds.map(id => nftsById[id])
)
