import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { getIsProfileEnabled } from '../../modules/features/selectors'
import { MapStateProps } from './LinkedProfile.types'
import { LinkedProfile } from './LinkedProfile'

const mapState = (state: RootState): MapStateProps => ({
  isProfileEnabled: getIsProfileEnabled(state)
})

export default connect(mapState)(LinkedProfile)
