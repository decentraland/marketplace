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
import { getData as getOrders } from '../../modules/order/selectors'
import { isNFT } from '../../modules/asset/utils'
import { NFT } from '../../modules/nft/types'
import { fetchItemRequest } from '../../modules/item/actions'
import { openModal } from '../../modules/modal/actions'
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
  const orders = getOrders(state)
  const order = isNFT(ownProps.asset)
    ? Object.values(orders).find(
        order =>
          order.contractAddress === ownProps.asset.contractAddress &&
          order.tokenId === (ownProps.asset as NFT).tokenId
      )
    : undefined

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
    item,
    order
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetIsTryingOn: value => dispatch(setIsTryingOn(value)),
  onSetWearablePreviewController: controller =>
    dispatch(setWearablePreviewController(controller)),
  onPlaySmartWearableVideoShowcase: (videoHash: string) =>
    dispatch(openModal('SmartWearableVideoShowcaseModal', { videoHash })),
  onFetchItem: (contractAddress: string, tokenId: string) =>
    dispatch(fetchItemRequest(contractAddress, tokenId))
})

export default connect(mapState, mapDispatch)(AssetImage)
