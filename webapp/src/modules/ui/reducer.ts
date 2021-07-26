import { combineReducers } from 'redux'
import { browseReducer as browse, BrowseUIState } from './browse/reducer'
import { nftReducer as nft, NFTUIState } from './nft/reducer'

export type UIState = {
  nft: NFTUIState
  browse: BrowseUIState
}

export const uiReducer = combineReducers({
  nft,
  browse
})
