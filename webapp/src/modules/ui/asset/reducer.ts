import { combineReducers } from 'redux'
import {
  homepageReducer as homepage,
  HomepageUIState
} from './homepage/reducer'

export type AssetUIState = {
  homepage: HomepageUIState
}

export const assetReducer = combineReducers({
  homepage
})
