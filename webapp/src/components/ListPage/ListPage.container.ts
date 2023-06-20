import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getIsListsV1Enabled } from '../../modules/features/selectors'
import {
  getError,
  getList,
  getLoading
} from '../../modules/favorites/selectors'
import {
  GET_LIST_REQUEST,
  deleteListStart,
  fetchFavoritedItemsRequest,
  getListRequest
} from '../../modules/favorites/actions'
import { RootState } from '../../modules/reducer'
import { getWallet, isConnecting } from '../../modules/wallet/selectors'
import { openModal } from '../../modules/modal/actions'
import { locations } from '../../modules/routing/locations'
import { getLoading as getLoadingItems } from '../../modules/item/selectors'
import { isLoadingFavoritedItems } from '../../modules/favorites/selectors'
import { getItemsPickedByUserOrCreator } from '../../modules/ui/browse/selectors'
import { FETCH_ITEMS_REQUEST } from '../../modules/item/actions'
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
    isConnecting: isConnecting(state),
    wallet: getWallet(state),
    listId,
    list: listId ? getList(state, listId) : null,
    isLoading:
      isLoadingType(getLoading(state), GET_LIST_REQUEST) ||
      isLoadingType(getLoadingItems(state), FETCH_ITEMS_REQUEST) ||
      isLoadingFavoritedItems(state),
    items: getItemsPickedByUserOrCreator(state),
    error: getError(state),
    isListV1Enabled: getIsListsV1Enabled(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBack: () => dispatch(push(locations.lists())),
  onFetchList: listId => dispatch(getListRequest(listId)),
  onEditList: list => dispatch(openModal('CreateOrEditListModal', { list })),
  onShareList: list => dispatch(openModal('ShareListModal', { list })),
  onDeleteList: list => dispatch(deleteListStart(list)),
  onFetchFavoritedItems: (options: any, force?) =>
    dispatch(fetchFavoritedItemsRequest(options, force))
})

export default connect(mapState, mapDispatch)(ListPage)
