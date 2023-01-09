import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../../modules/reducer'
import { browse } from '../../../modules/routing/actions'
import {
  getCurrentBrowseOptions,
  getSection
} from '../../../modules/routing/selectors'
import { MapStateProps, MapDispatchProps } from './SelectedFilters.types'
import { SelectedFilters } from './SelectedFilters'
import { isLandSection } from '../../../modules/ui/utils'
import { getCategoryFromSection } from '../../../modules/routing/search'
import { LANDFilters } from '../../Vendor/decentraland/types'

const mapState = (state: RootState): MapStateProps => {
  const section = getSection(state)
  const browseOptions = getCurrentBrowseOptions(state);

  let landStatus = LANDFilters.ALL_LAND;

  if (browseOptions.onlyOnRent) {
    landStatus = LANDFilters.ONLY_FOR_RENT
  } else if (browseOptions.onlyOnSale) {
    landStatus = LANDFilters.ONLY_FOR_SALE
  }
  return {
    landStatus,
    category: section ? getCategoryFromSection(section) : undefined,
    browseOptions,
    isLandSection: isLandSection(getSection(state))
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBrowse: options => dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(SelectedFilters)
