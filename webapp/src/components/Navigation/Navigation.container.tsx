import { connect } from 'react-redux'
import { getIsMVMFEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps } from './Navigation.types'
import Navigation from './Navigation'

const mapState = (state: RootState): MapStateProps => ({
  isMVMFEnabled: getIsMVMFEnabled(state)
})

export default connect(mapState)(Navigation)
