import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { IPreviewController } from '@dcl/schemas'
import { hasLoadedInitialFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { getIsUnityWearablePreviewEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { setWearablePreviewController } from '../../modules/ui/preview/actions'
import { getPortalPreviewProps } from '../../modules/ui/preview/selectors'
import { PortalWearablePreview } from './PortalWearablePreview'
import { MapStateProps, MapDispatchProps } from './PortalWearablePreview.types'

const mapState = (state: RootState): MapStateProps => ({
  ...getPortalPreviewProps(state),
  isUnityWearablePreviewEnabled: getIsUnityWearablePreviewEnabled(state),
  hasLoadedInitialFlags: hasLoadedInitialFlags(state)
})

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => ({
  onSetWearablePreviewController: (controller: IPreviewController | null) => dispatch(setWearablePreviewController(controller))
})

export default connect(mapState, mapDispatch)(PortalWearablePreview)
