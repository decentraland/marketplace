import { connect } from 'react-redux'
import { hasLoadedInitialFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { getIsUnityWearablePreviewEnabled } from '../../../../modules/features/selectors'
import { RootState } from '../../../../modules/reducer'
import { getPortalPreviewProps } from '../../../../modules/ui/portalPreview/selectors'
import { PortaledWearablePreview } from './PortaledWearablePreview'
import { MapStateProps } from './PortaledWearablePreview.types'

const mapState = (state: RootState): MapStateProps => ({
  ...getPortalPreviewProps(state),
  isUnityWearablePreviewEnabled: getIsUnityWearablePreviewEnabled(state),
  hasLoadedInitialFlags: hasLoadedInitialFlags(state)
})

export default connect(mapState)(PortaledWearablePreview)
