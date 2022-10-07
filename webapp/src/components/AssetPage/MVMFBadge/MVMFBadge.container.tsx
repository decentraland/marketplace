import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { getIsMVMFEnabled } from '../../../modules/features/selectors'
import { MapStateProps } from './MVMFBadge.types'
import MVMFBadge from './MVMFBadge'

const mapState = (state: RootState): MapStateProps => ({
  isMVMFEnabled: getIsMVMFEnabled(state)
})

export default connect(mapState)(MVMFBadge)
