import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { Avatar } from '@dcl/schemas'
import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { getWallet } from '../../modules/wallet/selectors'
import { getItem } from '../../modules/item/utils'
import {
  getIsTryingOn,
  getIsPlayingEmote,
  getWearablePreviewController
} from '../../modules/ui/preview/selectors'
import {
  setIsTryingOn,
  setWearablePreviewController
} from '../../modules/ui/preview/actions'
import { getData as getItems } from '../../modules/item/selectors'
import { fetchItemRequest } from '../../modules/item/actions'
import {
  MapStateProps,
  MapDispatchProps,
  MapDispatch,
  OwnProps
} from './AssetImage.types'
import AssetImage from './AssetImage'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const profiles = getProfiles(state)
  const wallet = getWallet(state)
  let avatar: Avatar | undefined = undefined
  const items = getItems(state)
  const item = getItem(
    ownProps.asset.contractAddress,
    ownProps.asset.itemId,
    items
  )

  if (wallet && !!profiles[wallet.address]) {
    const profile = profiles[wallet.address]
    avatar = profile.avatars[0]
  }
  return {
    wallet,
    avatar,
    wearableController: getWearablePreviewController(state),
    isTryingOn: getIsTryingOn(state),
    isPlayingEmote: getIsPlayingEmote(state),
    item
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetIsTryingOn: value => dispatch(setIsTryingOn(value)),
  onSetWearablePreviewController: controller =>
    dispatch(setWearablePreviewController(controller)),
  onFetchItem: (contractAddress: string, tokenId: string) =>
    dispatch(fetchItemRequest(contractAddress, tokenId))
})

export default connect(mapState, mapDispatch)(AssetImage)
