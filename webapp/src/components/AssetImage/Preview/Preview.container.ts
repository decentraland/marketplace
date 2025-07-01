import { connect } from 'react-redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { fetchSmartWearableVideoHashRequest } from '../../../modules/asset/actions'
import { getAssetData, getVideoHash, isFetchingVideoHash } from '../../../modules/asset/selectors'
import { Asset } from '../../../modules/asset/types'
import { RootState } from '../../../modules/reducer'
import { setPortalPreviewProps } from '../../../modules/ui/preview/actions'
import { Preview } from './Preview'
import { MapDispatchProps, MapDispatch, OwnProps, MapStateProps } from './Preview.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => ({
  videoHash: getVideoHash(state, ownProps.asset.id),
  isLoadingVideoHash: isFetchingVideoHash(state, ownProps.asset.id),
  hasFetchedVideoHash: 'videoHash' in getAssetData(state, ownProps.asset.id)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetPortalPreviewProps: props => dispatch(setPortalPreviewProps(props)),
  onPlaySmartWearableVideoShowcase: (videoHash: string) => dispatch(openModal('SmartWearableVideoShowcaseModal', { videoHash })),
  onFetchSmartWearableVideoHash: (asset: Asset) => dispatch(fetchSmartWearableVideoHashRequest(asset))
})

export default connect(mapState, mapDispatch)(Preview)
