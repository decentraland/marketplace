import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import {
  getIsFullscreen,
  getAssetType,
  getSection,
  getVendor
} from '../../modules/routing/selectors'
import { fetchEventRequest } from '../../modules/event/actions'
import { getData } from '../../modules/event/selectors'
import { MapStateProps, MapDispatch } from './MVMFPage.types'
import BrowsePage from './MVMFPage'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state),
  assetType: getAssetType(state),
  section: getSection(state),
  isFullscreen: getIsFullscreen(state),
  contracts: getData(state)
})

const mapDispatch = (dispatch: MapDispatch) => ({
  onFetchEventContracts: (tag: string) => dispatch(fetchEventRequest(tag))
})

export default connect(mapState, mapDispatch)(BrowsePage)
