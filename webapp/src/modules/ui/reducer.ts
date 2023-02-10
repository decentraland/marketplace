import { combineReducers } from 'redux'
import { assetReducer as asset, AssetUIState } from './asset/reducer'
import { browseReducer as browse, BrowseUIState } from './browse/reducer'
import { nftReducer as nft, NFTUIState } from './nft/reducer'
import { previewReducer as preview, PreviewState } from './preview/reducer'

export type UIState = {
  asset: AssetUIState
  nft: NFTUIState
  browse: BrowseUIState
  preview: PreviewState
}

export const uiReducer = combineReducers({
  asset,
  nft,
  browse,
  preview
})
