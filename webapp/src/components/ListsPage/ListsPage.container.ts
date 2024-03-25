import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { fetchListsRequest } from '../../modules/favorites/actions'
import { isLoadingLists, getError } from '../../modules/favorites/selectors'
import { RootState } from '../../modules/reducer'
import { getBrowseLists, getCount } from '../../modules/ui/browse/selectors'
import ListsPage from './ListsPage'
import { MapStateProps, MapDispatch, MapDispatchProps } from './ListsPage.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoading: isLoadingLists(state),
    lists: getBrowseLists(state),
    count: getCount(state),
    error: getError(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps =>
  bindActionCreators(
    {
      onFetchLists: fetchListsRequest,
      onCreateList: () => openModal('CreateOrEditListModal')
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(ListsPage)
