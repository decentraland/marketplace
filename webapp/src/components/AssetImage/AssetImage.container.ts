import { connect } from 'react-redux'
import { Avatar } from '@dcl/schemas'
import { getData as getProfiles } from 'decentraland-dapps/dist/modules/profile/selectors'
import { isNFT } from '../../modules/asset/utils'
import { fetchItemRequest } from '../../modules/item/actions'
import { getData as getItems } from '../../modules/item/selectors'
import { getItem } from '../../modules/item/utils'
import { NFT } from '../../modules/nft/types'
import { getData as getOrders } from '../../modules/order/selectors'
import { RootState } from '../../modules/reducer'
import { getWallet } from '../../modules/wallet/selectors'
import AssetImage from './AssetImage'
import { MapStateProps, MapDispatchProps, MapDispatch, OwnProps } from './AssetImage.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const profiles = getProfiles(state)
  const wallet = getWallet(state)
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
    avatar,
    wallet,
    item,
    order
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchItem: (contractAddress: string, tokenId: string) => dispatch(fetchItemRequest(contractAddress, tokenId))
})

export default connect(mapState, mapDispatch)(AssetImage)
