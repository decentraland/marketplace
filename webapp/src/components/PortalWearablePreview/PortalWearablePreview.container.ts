import { connect } from 'react-redux'
import { hasLoadedInitialFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { getIsUnityWearablePreviewEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { getPortalPreviewProps } from '../../modules/ui/preview/selectors'
import { PortalWearablePreview } from './PortalWearablePreview'
import { MapStateProps } from './PortalWearablePreview.types'

const mapState = (state: RootState): MapStateProps => ({
  ...getPortalPreviewProps(state),
  isUnityWearablePreviewEnabled: getIsUnityWearablePreviewEnabled(state),
  hasLoadedInitialFlags: hasLoadedInitialFlags(state)
})

export default connect(mapState)(PortalWearablePreview)
