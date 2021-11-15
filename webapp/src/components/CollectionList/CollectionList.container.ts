import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { connect } from 'react-redux'
import { FETCH_COLLECTIONS_REQUEST } from '../../modules/collection/actions'
import {
  getCollections,
  getCount,
  getLoading
} from '../../modules/collection/selectors'
import { RootState } from '../../modules/reducer'
import { browse } from '../../modules/routing/actions'
import { getPage, getSearch, getSortBy } from '../../modules/routing/selectors'
import CollectionList from './CollectionList'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './CollectionList.types'

const mapState = (state: RootState): MapStateProps => ({
  collections: getCollections(state),
  count: getCount(state),
  isLoading: isLoadingType(getLoading(state), FETCH_COLLECTIONS_REQUEST),
  search: getSearch(state),
  sortBy: getSortBy(state),
  page: getPage(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBrowse: options => dispatch(browse(options))
})

export default connect(mapState, mapDispatch)(CollectionList)
