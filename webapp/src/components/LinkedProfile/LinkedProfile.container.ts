import { connect } from 'react-redux'
import { getIsProfileEnabled } from '../../modules/features/selectors'
import { RootState } from '../../modules/reducer'
import { LinkedProfile } from './LinkedProfile'
import { MapStateProps } from './LinkedProfile.types'

const mapState = (state: RootState): MapStateProps => ({
  isProfileEnabled: getIsProfileEnabled(state)
})

export default connect(mapState)(LinkedProfile)
