import { connect } from 'react-redux'
import { getLocation } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { getData } from '../../modules/order/selectors'
import { isLand } from '../../modules/nft/utils'
import { getActiveOrder } from '../../modules/order/utils'
import { isClaimingBackLandTransactionPending } from '../../modules/ui/browse/selectors'
import { MapStateProps, OwnProps, MapDispatchProps } from './AssetCard.types'
import AssetCard from './AssetCard'
import { getView } from '../../modules/ui/browse/selectors'
import { getAssetPrice, isNFT } from '../../modules/asset/utils'
import { locations } from '../../modules/routing/locations'
import { View } from '../../modules/ui/types'
import {
  getMaxPriceOfPeriods,
  getOpenRentalId
} from '../../modules/rental/utils'
import { getRentalById } from '../../modules/rental/selectors'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { order, asset, rental } = ownProps
  const view = getView(state)
  let price: string | null = null

  if (!order) {
    const orders = getData(state)
    price = getAssetPrice(asset, getActiveOrder(asset, orders) || undefined)
  }

  let rentalPricePerDay: string | null = null
  const openRentalId = getOpenRentalId(asset)

  if (!rental && openRentalId && isLand(asset)) {
    // The price per day is the same in this version of rentals
    rentalPricePerDay = getMaxPriceOfPeriods(
      getRentalById(state, openRentalId)!
    )
  }

  return {
    rentalPricePerDay,
    price,
    showListedTag:
      Boolean(view === View.CURRENT_ACCOUNT && price) &&
      getLocation(state).pathname !== locations.root(),
    isClaimingBackLandTransactionPending: isNFT(asset)
      ? isClaimingBackLandTransactionPending(state, asset)
      : false
  }
}

const mapDispatch = (): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(AssetCard)
