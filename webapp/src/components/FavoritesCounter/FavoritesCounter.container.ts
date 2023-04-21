import { connect } from 'react-redux'
import { Item } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import {
  PICK_ITEM_AS_FAVORITE_REQUEST,
  UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST,
  UNPICK_ITEM_AS_FAVORITE_REQUEST,
  pickItemAsFavoriteRequest,
  unpickItemAsFavoriteRequest
} from '../../modules/favorites/actions'
import {
  getIsPickedByUser,
  getCount,
  getLoading
} from '../../modules/favorites/selectors'
import { RootState } from '../../modules/reducer'
import FavoritesCounter from './FavoritesCounter'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './FavoritesCounter.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const {
    item: { id: itemId }
  } = ownProps
  return {
    isPickedByUser: getIsPickedByUser(state, itemId),
    count: getCount(state, itemId),
    isLoading: getLoading(state).some(
      ({ type, payload }) =>
        [
          PICK_ITEM_AS_FAVORITE_REQUEST,
          UNPICK_ITEM_AS_FAVORITE_REQUEST,
          UNDO_UNPICKING_ITEM_AS_FAVORITE_REQUEST
        ].includes(type) && payload.item.id === itemId
    )
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onPick: (item: Item) => dispatch(pickItemAsFavoriteRequest(item)),
  onUnpick: (item: Item) => dispatch(unpickItemAsFavoriteRequest(item)),
  onCounterClick: (item: Item) =>
    dispatch(openModal('FavoritesModal', { itemId: item.id }))
})

export default connect(mapState, mapDispatch)(FavoritesCounter)
