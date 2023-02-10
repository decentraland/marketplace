import { connect } from 'react-redux'
import { getIsCampaignCollectionsBannerEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { getIsFullscreen, getAssetType, getSection, getVendor, getContracts } from '../../modules/routing/selectors'
import BrowsePage from './BrowsePage'
import { MapStateProps } from './BrowsePage.types'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state),
  assetType: getAssetType(state),
  section: getSection(state),
  isCampaignCollectiblesBannerEnabled: getIsCampaignCollectionsBannerEnabled(state),
  isFullscreen: getIsFullscreen(state),
  contracts: getContracts(state)
})

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(BrowsePage)
