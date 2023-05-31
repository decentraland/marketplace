import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { RootState } from '../../modules/reducer'
import { getBrowseLists, getCount } from '../../modules/ui/browse/selectors'
import { isLoadingLists } from '../../modules/favorites/selectors'
import { fetchListsRequest } from '../../modules/favorites/actions'
import { MapStateProps, MapDispatch, MapDispatchProps } from './ListsPage.types'
import ListsPage from './ListsPage'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoading: isLoadingLists(state),
    lists: getBrowseLists(state),
    count: getCount(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps =>
  bindActionCreators(
    {
      onFetchLists: fetchListsRequest,
      onCreateList: () => openModal('CreateListModal')
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(ListsPage)
