import { connect } from 'react-redux'
import { replace } from 'connected-react-router'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getList } from '../../modules/favorites/selectors'
import {
  GET_LIST_REQUEST,
  getListRequest
} from '../../modules/favorites/actions'
import { RootState } from '../../modules/reducer'
import { goBack } from '../../modules/routing/actions'
import {
  getLoading,
  getWallet,
  isConnecting
} from '../../modules/wallet/selectors'
import { openModal } from '../../modules/modal/actions'
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
    isConnecting: isConnecting(state),
    listId,
    list: listId ? getList(state, listId) : null,
    isLoading: isLoadingType(getLoading(state), GET_LIST_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onBack: () => dispatch(goBack()),
  onRedirect: path => dispatch(replace(path)),
  onFetchList: listId => dispatch(getListRequest(listId)),
  onEditList: list => dispatch(openModal('CreateOrEditListModal', { list })),
  onDeleteList: listId => dispatch(openModal('DeleteListModal', { listId }))
})

export default connect(mapState, mapDispatch)(ListPage)
