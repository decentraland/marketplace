import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getIsMVMFTabEnabled } from '../../../modules/features/selectors'
import { MapStateProps } from './MVMFBadge.types'
import MVMFBadge from './MVMFBadge'

const mapState = (state: RootState): MapStateProps => ({
  isMVMFTabEnabled: getIsMVMFTabEnabled(state)
})

export default connect(mapState)(MVMFBadge)
