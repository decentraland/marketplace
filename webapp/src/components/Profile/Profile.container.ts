import { connect } from 'react-redux'
import { getData as getProfiles } from '../../modules/profile/selectors'
import { loadProfileRequest } from '../../modules/profile/actions'
import { RootState } from '../../modules/reducer'
import {
  OwnProps,
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './Profile.types'
import Profile from './Profile'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const profile = getProfiles(state)[ownProps.address]
  return {
    avatar: profile ? profile.avatars[0] : null
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onLoadProfile: address => dispatch(loadProfileRequest(address))
})

export default connect(mapState, mapDispatch)(Profile)
