import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { setUnityPreloaderStatus } from '../../modules/ui/preview/actions'
import { getUnityPreloaderIsLoading, getUnityPreloaderIsReady } from '../../modules/ui/preview/selectors'
import UnityPreloader from './UnityPreloader'
import { MapStateProps, MapDispatchProps, MapDispatch } from './UnityPreloader.types'

const mapState = (state: RootState): MapStateProps => ({
  isLoading: getUnityPreloaderIsLoading(state),
  isReady: getUnityPreloaderIsReady(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetUnityPreloaderStatus: (isLoading, isReady) => dispatch(setUnityPreloaderStatus(isLoading, isReady))
})

export default connect(mapState, mapDispatch)(UnityPreloader)
