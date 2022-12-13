import { connect } from 'react-redux'
import { getIsMVMFTabEnabled } from '../../modules/features/selectors'
import { getIsFullscreen } from '../../modules/routing/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps } from './Navigation.types'
import Navigation from './Navigation'

const mapState = (state: RootState): MapStateProps => ({
  isMVMFTabEnabled: getIsMVMFTabEnabled(state),
  isFullScreen: getIsFullscreen(state)
})

export default connect(mapState)(Navigation)
