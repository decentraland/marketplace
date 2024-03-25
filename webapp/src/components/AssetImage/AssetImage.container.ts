import { connect } from 'react-redux'
import { Avatar } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { fetchSmartWearableVideoHashRequest } from '../../modules/asset/actions'
import { getVideoHash, getAssetData, isFetchingVideoHash } from '../../modules/asset/selectors'
import { Asset } from '../../modules/asset/types'
import { isNFT } from '../../modules/asset/utils'
import { fetchItemRequest } from '../../modules/item/actions'
import { getData as getItems } from '../../modules/item/selectors'
import { getItem } from '../../modules/item/utils'
import { NFT } from '../../modules/nft/types'
import { getData as getOrders } from '../../modules/order/selectors'
import { RootState } from '../../modules/reducer'
import { setIsTryingOn, setWearablePreviewController } from '../../modules/ui/preview/actions'
import { getIsTryingOn, getIsPlayingEmote, getWearablePreviewController } from '../../modules/ui/preview/selectors'
import { getWallet } from '../../modules/wallet/selectors'
import AssetImage from './AssetImage'
import { MapStateProps, MapDispatchProps, MapDispatch, OwnProps } from './AssetImage.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const profiles = getProfiles(state)
  const wallet = getWallet(state)
  const assetId = ownProps.asset.id
  let avatar: Avatar | undefined = undefined
  const items = getItems(state)
  const item = getItem(ownProps.asset.contractAddress, ownProps.asset.itemId, items)
  const orders = getOrders(state)
  const order = isNFT(ownProps.asset)
    ? Object.values(orders).find(
        order => order.contractAddress === ownProps.asset.contractAddress && order.tokenId === (ownProps.asset as NFT).tokenId
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
    order,
    videoHash: getVideoHash(state, assetId),
    isLoadingVideoHash: isFetchingVideoHash(state, assetId),
    hasFetchedVideoHash: 'videoHash' in getAssetData(state, assetId)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetIsTryingOn: value => dispatch(setIsTryingOn(value)),
  onSetWearablePreviewController: controller => dispatch(setWearablePreviewController(controller)),
  onPlaySmartWearableVideoShowcase: (videoHash: string) => dispatch(openModal('SmartWearableVideoShowcaseModal', { videoHash })),
  onFetchItem: (contractAddress: string, tokenId: string) => dispatch(fetchItemRequest(contractAddress, tokenId)),
  onFetchSmartWearableVideoHash: (asset: Asset) => dispatch(fetchSmartWearableVideoHashRequest(asset))
})

export default connect(mapState, mapDispatch)(AssetImage)
