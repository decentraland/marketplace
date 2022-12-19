import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getIsCampaignBrowserEnabled } from '../../../modules/features/selectors'
import { MapStateProps } from './CampaignBadge.types'
import MVMFBadge from './CampaignBadge'

const mapState = (state: RootState): MapStateProps => ({
  isCampaignBrowserEnabled: getIsCampaignBrowserEnabled(state)
})

export default connect(mapState)(MVMFBadge)
