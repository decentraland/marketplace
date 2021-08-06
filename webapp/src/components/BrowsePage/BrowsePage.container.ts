import { connect } from 'react-redux'

import { RootState } from '../../modules/reducer'
import {
  getIsFullscreen,
  getAssetType,
  getSection,
  getVendor
} from '../../modules/routing/selectors'
import { MapStateProps } from './BrowsePage.types'
import BrowsePage from './BrowsePage'
import { Section } from '../../modules/vendor/decentraland'

const mapState = (state: RootState): MapStateProps => {
  let section = getSection(state) as Section
  if (section === Section.ALL) {
    section = Section.WEARABLES
  }
  return {
    vendor: getVendor(state),
    assetType: getAssetType(state),
    section,
    isFullscreen: getIsFullscreen(state)
  }
}

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(BrowsePage)
