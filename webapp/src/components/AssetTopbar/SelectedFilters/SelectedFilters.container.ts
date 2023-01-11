import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getLoading as getLoadingNFTs } from '../../../modules/nft/selectors'
import { getLoading as getLoadingItems } from '../../../modules/item/selectors'
import { RootState } from '../../../modules/reducer'
import { browse } from '../../../modules/routing/actions'
import { AssetType } from '../../../modules/asset/types'
import { isLandSection } from '../../../modules/ui/utils'
import {
  getAssetType,
  getCurrentBrowseOptions,
  getSection
} from '../../../modules/routing/selectors'
import { FETCH_ITEMS_REQUEST } from '../../../modules/item/actions'
import { FETCH_NFTS_REQUEST } from '../../../modules/nft/actions'
import { MapStateProps, MapDispatchProps } from './SelectedFilters.types'
import { SelectedFilters } from './SelectedFilters'
import { getCategoryFromSection } from '../../../modules/routing/search'

const mapState = (state: RootState): MapStateProps => {
  const section = getSection(state)
  const browseOptions = getCurrentBrowseOptions(state)

  return {
    category: section ? getCategoryFromSection(section) : undefined,
    browseOptions,
    isLoading:
      getAssetType(state) === AssetType.ITEM
        ? isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST)
        : isLoadingType(getLoadingNFTs(state), FETCH_NFTS_REQUEST),
    isLandSection: isLandSection(getSection(state))
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBrowse: options => dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(SelectedFilters)
