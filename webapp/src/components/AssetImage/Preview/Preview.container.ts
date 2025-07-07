import { connect } from 'react-redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { fetchSmartWearableVideoHashRequest } from '../../../modules/asset/actions'
import { getAssetData, getVideoHash, isFetchingVideoHash } from '../../../modules/asset/selectors'
import { Asset } from '../../../modules/asset/types'
import { RootState } from '../../../modules/reducer'
import { setIsTryingOn, setPortalPreviewProps } from '../../../modules/ui/preview/actions'
import { getIsTryingOn, getPortalPreviewProps, getWearablePreviewController } from '../../../modules/ui/preview/selectors'
import { Preview } from './Preview'
import { MapDispatchProps, MapDispatch, OwnProps, MapStateProps } from './Preview.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  videoHash: getVideoHash(state, ownProps.asset.id),
  portalPreviewProps: getPortalPreviewProps(state),
  wearablePreviewController: getWearablePreviewController(state),
  isLoadingVideoHash: isFetchingVideoHash(state, ownProps.asset.id),
  isTryingOn: getIsTryingOn(state),
  hasFetchedVideoHash: 'videoHash' in getAssetData(state, ownProps.asset.id)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetTryingOn: (value: boolean) => dispatch(setIsTryingOn(value)),
  onSetPortalPreviewProps: props => dispatch(setPortalPreviewProps(props)),
  onPlaySmartWearableVideoShowcase: (videoHash: string) => dispatch(openModal('SmartWearableVideoShowcaseModal', { videoHash })),
  onFetchSmartWearableVideoHash: (asset: Asset) => dispatch(fetchSmartWearableVideoHashRequest(asset))
})

export default connect(mapState, mapDispatch)(Preview)
