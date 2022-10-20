import { connect } from 'react-redux'
import { getIsMVMFTabEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps } from './Navigation.types'
import Navigation from './Navigation'

const mapState = (state: RootState): MapStateProps => ({
  isMVMFTabEnabled: getIsMVMFTabEnabled(state)
})

export default connect(mapState)(Navigation)
