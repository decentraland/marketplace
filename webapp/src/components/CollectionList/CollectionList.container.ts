import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { FETCH_COLLECTIONS_REQUEST, fetchCollectionsRequest } from '../../modules/collection/actions'
import { getCollections, getCount, getLoading } from '../../modules/collection/selectors'
import { RootState } from '../../modules/reducer'
import CollectionList from './CollectionList'
import { MapStateProps, MapDispatch, MapDispatchProps } from './CollectionList.types'

const mapState = (state: RootState): MapStateProps => ({
  collections: getCollections(state),
  count: getCount(state),
  isLoading: isLoadingType(getLoading(state), FETCH_COLLECTIONS_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps =>
  bindActionCreators(
    {
      onFetchCollections: fetchCollectionsRequest
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(CollectionList)
