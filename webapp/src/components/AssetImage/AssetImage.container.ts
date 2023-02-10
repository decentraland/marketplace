import { connect } from 'react-redux'
import { Avatar } from '@dcl/schemas'
import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { RootState } from '../../modules/reducer'
import { setIsTryingOn, setWearablePreviewController } from '../../modules/ui/preview/actions'
import { getIsTryingOn, getIsPlayingEmote, getWearablePreviewController } from '../../modules/ui/preview/selectors'
import { getWallet } from '../../modules/wallet/selectors'
import AssetImage from './AssetImage'
import { MapStateProps, MapDispatchProps, MapDispatch } from './AssetImage.types'

const mapState = (state: RootState): MapStateProps => {
  const profiles = getProfiles(state)
  const wallet = getWallet(state)
  let avatar: Avatar | undefined = undefined
  if (wallet && !!profiles[wallet.address]) {
    const profile = profiles[wallet.address]
    avatar = profile.avatars[0]
  }
  return {
    avatar,
    wearableController: getWearablePreviewController(state),
    isTryingOn: getIsTryingOn(state),
    isPlayingEmote: getIsPlayingEmote(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetIsTryingOn: value => dispatch(setIsTryingOn(value)),
  onSetWearablePreviewController: controller => dispatch(setWearablePreviewController(controller))
})

export default connect(mapState, mapDispatch)(AssetImage)
