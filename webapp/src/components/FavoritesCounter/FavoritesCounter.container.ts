import { connect } from 'react-redux'
import { Item } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import {
  pickItemAsFavoriteRequest,
  unpickItemAsFavoriteRequest
} from '../../modules/favorites/actions'
import { getIsPickedByUser, getCount } from '../../modules/favorites/selectors'
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
    count: getCount(state, itemId)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onPick: (item: Item) => dispatch(pickItemAsFavoriteRequest(item)),
  onUnpick: (item: Item) => dispatch(unpickItemAsFavoriteRequest(item)),
  onCounterClick: (item: Item) =>
    dispatch(openModal('FavoritesModal', { itemId: item.id }))
})

export default connect(mapState, mapDispatch)(FavoritesCounter)
