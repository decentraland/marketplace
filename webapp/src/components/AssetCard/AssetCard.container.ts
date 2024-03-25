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
import { getPageName, getSortBy, getWearablesUrlParams } from '../../modules/routing/selectors'
import { PageName } from '../../modules/routing/types'
import { isClaimingBackLandTransactionPending } from '../../modules/ui/browse/selectors'
import AssetCard from './AssetCard'
import { MapStateProps, OwnProps } from './AssetCard.types'

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

export default connect(mapState)(AssetCard)
