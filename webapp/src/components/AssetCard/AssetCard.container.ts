import { connect } from 'react-redux'
import { getLocation } from 'connected-react-router'
import { RentalListing } from '@dcl/schemas'
import { RootState } from '../../modules/reducer'
import { getData } from '../../modules/order/selectors'
import { getActiveOrder } from '../../modules/order/utils'
import { isClaimingBackLandTransactionPending } from '../../modules/ui/browse/selectors'
import { getView } from '../../modules/ui/browse/selectors'
import { getAssetPrice, isNFT } from '../../modules/asset/utils'
import { locations } from '../../modules/routing/locations'
import { View } from '../../modules/ui/types'
import { getOpenRentalId } from '../../modules/rental/utils'
import { getRentalById } from '../../modules/rental/selectors'
import { MapStateProps, OwnProps, MapDispatchProps } from './AssetCard.types'
import AssetCard from './AssetCard'
import { getIsFavoritesEnabled } from '../../modules/features/selectors'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { order, asset } = ownProps
  const view = getView(state)
  let price: string | null = null

  if (!order) {
    const orders = getData(state)
    price = getAssetPrice(asset, getActiveOrder(asset, orders) || undefined)
  }

  const openRentalId = getOpenRentalId(asset)
  let rentalOfNFT: RentalListing | null = openRentalId
    ? getRentalById(state, openRentalId)
    : null

  return {
    price,
    showListedTag:
      Boolean(view === View.CURRENT_ACCOUNT && price) &&
      getLocation(state).pathname !== locations.root(),
    isClaimingBackLandTransactionPending: isNFT(asset)
      ? isClaimingBackLandTransactionPending(state, asset)
      : false,
    rental: rentalOfNFT,
    showRentalChip:
      rentalOfNFT !== null &&
      view === View.CURRENT_ACCOUNT &&
      getLocation(state).pathname !== locations.root(),
    isFavoritesEnabled: getIsFavoritesEnabled(state)
  }
}

const mapDispatch = (): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(AssetCard)
