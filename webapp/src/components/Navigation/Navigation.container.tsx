import { connect } from 'react-redux'
import { getIsMVMFAnnouncementEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps } from './Navigation.types'
import Navigation from './Navigation'

const mapState = (state: RootState): MapStateProps => ({
  isMVMFAnnouncementEnabled: getIsMVMFAnnouncementEnabled(state)
})

export default connect(mapState)(Navigation)
