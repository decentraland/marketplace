import { connect } from 'react-redux'
import { getLocation } from 'connected-react-router'
import { RentalListing } from '@dcl/schemas'
import { getAssetPrice, isNFT } from '../../modules/asset/utils'
import { getData } from '../../modules/order/selectors'
import { getActiveOrder } from '../../modules/order/utils'
import { RootState } from '../../modules/reducer'
import { getRentalById } from '../../modules/rental/selectors'
import { getOpenRentalId } from '../../modules/rental/utils'
import { locations } from '../../modules/routing/locations'
import { isClaimingBackLandTransactionPending, getView } from '../../modules/ui/browse/selectors'
import { View } from '../../modules/ui/types'
import AssetCard from './AssetCard'
import { MapStateProps, OwnProps, MapDispatchProps } from './AssetCard.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { order, asset } = ownProps
  const view = getView(state)
  let price: string | null = null

  if (!order) {
    const orders = getData(state)
    price = getAssetPrice(asset, getActiveOrder(asset, orders) || undefined)
  }

  const openRentalId = getOpenRentalId(asset)
  const rentalOfNFT: RentalListing | null = openRentalId ? getRentalById(state, openRentalId) : null

  return {
    price,
    showListedTag: Boolean(view === View.CURRENT_ACCOUNT && price) && getLocation(state).pathname !== locations.root(),
    isClaimingBackLandTransactionPending: isNFT(asset) ? isClaimingBackLandTransactionPending(state, asset) : false,
    rental: rentalOfNFT,
    showRentalChip: rentalOfNFT !== null && view === View.CURRENT_ACCOUNT && getLocation(state).pathname !== locations.root()
  }
}

const mapDispatch = (): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(AssetCard)
