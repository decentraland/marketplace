import { combineReducers } from 'redux'
import { assetReducer as asset, AssetUIState } from './asset/reducer'
import { browseReducer as browse, BrowseUIState } from './browse/reducer'
import { previewReducer as preview, PreviewState } from './preview/reducer'

export type UIState = {
  asset: AssetUIState
  browse: BrowseUIState
  preview: PreviewState
}

export const uiReducer = combineReducers({
  asset,
  browse,
  preview
})
