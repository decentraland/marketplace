import { combineReducers } from 'redux'
import { nftReducer as nft, NFTUIState } from './nft/reducer'

export type UIState = {
  nft: NFTUIState
}

export const uiReducer = combineReducers({
  nft
})
