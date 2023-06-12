import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import {
  getError,
  getList,
  getLoading
} from '../../modules/favorites/selectors'
import {
  GET_LIST_REQUEST,
  deleteListStart,
  getListRequest
} from '../../modules/favorites/actions'
import { RootState } from '../../modules/reducer'
import { getWallet } from '../../modules/wallet/selectors'
import { openModal } from '../../modules/modal/actions'
import { locations } from '../../modules/routing/locations'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps,
  OwnProps
} from './ListPage.types'
import ListPage from './ListPage'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const { listId } = ownProps.match.params

  return {
    wallet: getWallet(state),
    listId,
    list: listId ? getList(state, listId) : null,
    isLoading: isLoadingType(getLoading(state), GET_LIST_REQUEST),
    error: getError(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBack: () => dispatch(push(locations.lists())),
  onFetchList: listId => dispatch(getListRequest(listId)),
  onEditList: list => dispatch(openModal('CreateOrEditListModal', { list })),
  onShareList: list => dispatch(openModal('ShareListModal', { list })),
  onDeleteList: list => dispatch(deleteListStart(list))
})

export default connect(mapState, mapDispatch)(ListPage)
