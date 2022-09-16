import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { Avatar } from '@dcl/schemas'
import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { getWallet } from '../../modules/wallet/selectors'
import {
  getIsTryingOn,
  getIsPlayingEmote,
  getWearablePreviewController
} from '../../modules/ui/preview/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './AssetImage.types'
import AssetImage from './AssetImage'
import {
  setIsTryingOn,
  setWearablePreviewController
} from '../../modules/ui/preview/actions'

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
  onSetWearablePreviewController: controller =>
    dispatch(setWearablePreviewController(controller))
})

export default connect(mapState, mapDispatch)(AssetImage)
