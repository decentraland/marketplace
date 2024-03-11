import { connect } from 'react-redux'
import { getLocation } from 'connected-react-router'
import { RentalListing } from '@dcl/schemas'
import { RootState } from '../../modules/reducer'
import { getData } from '../../modules/order/selectors'
import { getActiveOrder } from '../../modules/order/utils'
import { isClaimingBackLandTransactionPending } from '../../modules/ui/browse/selectors'
import { getAssetPrice, isNFT } from '../../modules/asset/utils'
import { locations } from '../../modules/routing/locations'
import { getOpenRentalId } from '../../modules/rental/utils'
import { getRentalById } from '../../modules/rental/selectors'
import { getPageName, getSortBy, getWearablesUrlParams } from '../../modules/routing/selectors'
import { PageName } from '../../modules/routing/types'
import { MapStateProps, OwnProps, MapDispatchProps } from './AssetCard.types'
import AssetCard from './AssetCard'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { order, asset } = ownProps
  const pageName = getPageName(state)
  let price: string | null = null

  if (!order) {
    const orders = getData(state)
    price = getAssetPrice(asset, getActiveOrder(asset, orders) || undefined)
  }

  const openRentalId = getOpenRentalId(asset)
  const rentalOfNFT: RentalListing | null = openRentalId ? getRentalById(state, openRentalId) : null

  const { minPrice, maxPrice } = getWearablesUrlParams(state)

  return {
    price,
    showListedTag: pageName === PageName.ACCOUNT && Boolean(price) && getLocation(state).pathname !== locations.root(),
    isClaimingBackLandTransactionPending: isNFT(asset) ? isClaimingBackLandTransactionPending(state, asset) : false,
    rental: rentalOfNFT,
    showRentalChip: rentalOfNFT !== null && pageName === PageName.ACCOUNT,
    sortBy: getSortBy(state),
    appliedFilters: {
      minPrice,
      maxPrice
    }
  }
}

const mapDispatch = (): MapDispatchProps => ({})

export default connect(mapState, mapDispatch)(AssetCard)
