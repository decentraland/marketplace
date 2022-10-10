import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import {
  getIsMVMFEnabled,
  getIsMVMFAnnouncementEnabled
} from '../../../modules/features/selectors'
import { RootState } from '../../../modules/reducer'
import {
  MapDispatchProps,
  MapDispatch,
  MapStateProps
} from './MVMFBanner.types'
import MVMFBanner from './MVMFBanner'

const mapState = (state: RootState): MapStateProps => ({
  isMVMFEnabled: getIsMVMFEnabled(state),
  isMVMFAnnouncementEnabled: getIsMVMFAnnouncementEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onNavigate: path => dispatch(push(path))
})

export default connect(mapState, mapDispatch)(MVMFBanner)
