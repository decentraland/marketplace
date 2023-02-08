import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../modules/reducer'
import { getCategoryFromSection } from '../../modules/routing/search'
import {
  getAssetType,
  getContracts,
  getEmotePlayMode,
  getMaxEstateSize,
  getMaxPrice,
  getMinEstateSize,
  getMinPrice,
  getNetwork,
  getOnlyOnRent,
  getOnlyOnSale,
  getOnlySmart,
  getRarities,
  getSection,
  getWearableGenders
} from '../../modules/routing/selectors'
import {
  getIsEstateSizeFilterEnabled,
  getIsPriceFilterEnabled
} from '../../modules/features/selectors'
import { LANDFilters } from '../Vendor/decentraland/types'
import { browse } from '../../modules/routing/actions'
import { Section } from '../../modules/vendor/routing/types'
import { getView } from '../../modules/ui/browse/selectors'
import { MapDispatchProps, MapStateProps, OwnProps } from './AssetFilters.types'
import { AssetFilters } from './AssetFilters'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { values = {} } = ownProps
  const section =
    'section' in values ? (values.section as Section) : getSection(state)
  const contracts =
    'contracts' in values ? values.contracts || [] : getContracts(state)
  const onlyOnSale =
    'onlyOnSale' in values ? values.onlyOnSale : getOnlyOnSale(state)
  const onlyOnRent =
    'onlyOnRent' in values ? values.onlyOnRent : getOnlyOnRent(state)
  let landStatus = LANDFilters.ALL_LAND

  if (onlyOnRent && !onlyOnSale) {
    landStatus = LANDFilters.ONLY_FOR_RENT
  } else if (onlyOnSale && !onlyOnRent) {
    landStatus = LANDFilters.ONLY_FOR_SALE
  }

  return {
    minPrice: 'minPrice' in values ? values.minPrice || '' : getMinPrice(state),
    maxPrice: 'maxPrice' in values ? values.maxPrice || '' : getMaxPrice(state),
    minEstateSize:
      'minEstateSize' in values
        ? values.minEstateSize || ''
        : getMinEstateSize(state),
    maxEstateSize:
      'maxEstateSize' in values
        ? values.maxEstateSize || ''
        : getMaxEstateSize(state),
    rarities: 'rarities' in values ? values.rarities || [] : getRarities(state),
    network: 'network' in values ? values.network : getNetwork(state),
    bodyShapes:
      'wearableGenders' in values
        ? values.wearableGenders
        : getWearableGenders(state),
    category: section ? getCategoryFromSection(section) : undefined,
    isOnlySmart:
      'onlySmart' in values ? !!values.onlySmart : getOnlySmart(state),
    isOnSale: onlyOnSale,
    emotePlayMode: values.emotePlayMode || getEmotePlayMode(state),
    assetType: getAssetType(state),
    collection: contracts[0],
    landStatus,
    view: getView(state),
    section,
    isPriceFilterEnabled: getIsPriceFilterEnabled(state),
    isEstateSizeFilterEnabled: getIsEstateSizeFilterEnabled(state)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps => {
  return {
    onBrowse: options =>
      ownProps.onFilterChange
        ? ownProps.onFilterChange(options)
        : dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(AssetFilters)
