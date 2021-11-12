import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { connect } from 'react-redux'
import {
  fetchCollectionTotalRequest,
  FETCH_COLLECTIONS_REQUEST,
  FETCH_COLLECTION_TOTAL_REQUEST
} from '../../modules/collection/actions'
import {
  getCollections,
  getCount,
  getLoading,
  getTotal
} from '../../modules/collection/selectors'
import { RootState } from '../../modules/reducer'
import { browse } from '../../modules/routing/actions'
import { getPage, getSearch, getSortBy } from '../../modules/routing/selectors'
import { getAddress } from '../../modules/wallet/selectors'
import CollectionList from './CollectionList'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './CollectionList.types'

const mapState = (state: RootState): MapStateProps => ({
  address: getAddress(state)!,
  collections: getCollections(state),
  count: getCount(state),
  total: getTotal(state),
  isLoading:
    isLoadingType(getLoading(state), FETCH_COLLECTIONS_REQUEST) ||
    isLoadingType(getLoading(state), FETCH_COLLECTION_TOTAL_REQUEST),
  search: getSearch(state),
  sortBy: getSortBy(state),
  page: getPage(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options)),
  onFetchCollectionTotal: filters =>
    dispatch(fetchCollectionTotalRequest(filters))
})

export default connect(mapState, mapDispatch)(CollectionList)
