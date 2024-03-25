import { connect } from 'react-redux'
import { fetchEventRequest } from '../../../modules/event/actions'
import { getData as getContracts } from '../../../modules/event/selectors'
import { getIsCampaignBrowserEnabled } from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import { getIsFullscreen, getAssetType, getSection, getVendor } from '../../../modules/routing/selectors'
import BrowsePage from './CampaignBrowserPage'
import { MapStateProps, MapDispatch } from './CampaignBrowserPage.types'

const mapState = (state: RootState): MapStateProps => ({
  vendor: getVendor(state),
  assetType: getAssetType(state),
  section: getSection(state),
  isFullscreen: getIsFullscreen(state),
  contracts: getContracts(state),
  isCampaignBrowserEnabled: getIsCampaignBrowserEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch) => ({
  onFetchEventContracts: (eventTag: string, additionalSearchTags: string[] = []) =>
    dispatch(fetchEventRequest(eventTag, additionalSearchTags))
})

export default connect(mapState, mapDispatch)(BrowsePage)
