import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { Avatar } from 'decentraland-ui'
import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { getWallet } from '../../modules/wallet/selectors'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch
} from './AssetImage.types'
import AssetImage from './AssetImage'

const mapState = (state: RootState): MapStateProps => {
  const profiles = getProfiles(state)
  const wallet = getWallet(state)
  let avatar: Avatar | undefined = undefined
  if (wallet && !!profiles[wallet.address]) {
    const profile = profiles[wallet.address]
    avatar = profile.avatars[0]
  }
  return {
    avatar
  }
}

const mapDispatch = (_dispatch: MapDispatch): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(AssetImage)
