import { connect } from 'react-redux'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { SET_PROFILE_AVATAR_ALIAS_REQUEST, setProfileAvatarAliasRequest } from 'decentraland-dapps/dist/modules/profile/actions'
import { getProfileOfAddress, getLoading } from 'decentraland-dapps/dist/modules/profile/selectors'
import { RootState } from '../../../modules/reducer'
import { MapDispatch, MapDispatchProps, MapState } from './SetNameAsAliasModal.types'
import SetNameAsAliasModal from './SetNameAsAliasModal'

const mapState = (state: RootState): MapState => {
  const address = getAddress(state)
  const profile = address ? getProfileOfAddress(state, address) : undefined
  return {
    isLoading: isLoadingType(getLoading(state), SET_PROFILE_AVATAR_ALIAS_REQUEST),
    address,
    profile
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSubmit: (address, name) => dispatch(setProfileAvatarAliasRequest(address, name))
})

export default connect(mapState, mapDispatch)(SetNameAsAliasModal)
