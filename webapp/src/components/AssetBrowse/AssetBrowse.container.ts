import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'

import { RootState } from '../../modules/reducer'
import { setView } from '../../modules/ui/actions'
import { browse, fetchAssetsFromRoute } from '../../modules/routing/actions'
import { FETCH_NFTS_REQUEST } from '../../modules/nft/actions'
import { getLoading as getLoadingNFTs } from '../../modules/nft/selectors'
import { getLoading as getLoadingItems } from '../../modules/item/selectors'
import {
  getIsMap,
  getOnlyOnSale,
  getAssetType,
  getSection,
  getOnlySmart
} from '../../modules/routing/selectors'
import { getView } from '../../modules/ui/browse/selectors'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
import { getIsRentalsEnabled } from '../../modules/features/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps,
  OwnProps,
  Props
} from './AssetBrowse.types'
import AssetBrowse from './AssetBrowse'

const mapState = (state: RootState): MapStateProps => ({
  isMap: getIsMap(state),
  onlyOnSale: getOnlyOnSale(state),
  section: getSection(state),
  isLoading:
    isLoadingType(getLoadingNFTs(state), FETCH_NFTS_REQUEST) ||
    isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST),
  assetType: getAssetType(state),
  viewInState: getView(state),
  onlySmart: getOnlySmart(state),
  isRentalsEnabled: getIsRentalsEnabled(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSetView: view => dispatch(setView(view)),
  onFetchAssetsFromRoute: options => dispatch(fetchAssetsFromRoute(options)),
  onBrowse: options => dispatch(browse(options))
})

const mergeProps = (
  stateProps: MapStateProps,
  dispatchProps: MapDispatchProps,
  ownProps: OwnProps
): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  section: ownProps.section ?? stateProps.section,
  isMap: stateProps.isMap ?? ownProps.isMap
})

export default connect(mapState, mapDispatch, mergeProps)(AssetBrowse)
