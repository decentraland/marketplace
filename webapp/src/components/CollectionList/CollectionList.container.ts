import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { connect } from 'react-redux'
import { FETCH_COLLECTIONS_REQUEST } from '../../modules/collection/actions'
import { getCollections, getLoading } from '../../modules/collection/selectors'
import { RootState } from '../../modules/reducer'
import CollectionList from './CollectionList'
import { MapStateProps } from './CollectionList.types'

const mapState = (state: RootState): MapStateProps => ({
  collections: getCollections(state),
  isLoading: isLoadingType(getLoading(state), FETCH_COLLECTIONS_REQUEST)
})

export default connect(mapState)(CollectionList)
