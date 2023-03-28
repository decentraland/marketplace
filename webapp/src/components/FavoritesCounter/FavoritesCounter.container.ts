import { connect } from 'react-redux'
import { Item } from '@dcl/schemas'
import {
  pickItemAsFavoriteRequest,
  unpickItemAsFavoriteRequest
} from '../../modules/favorites/actions'
import { RootState } from '../../modules/reducer'
import FavoritesCounter from './FavoritesCounter'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './FavoritesCounter.types'
import { getAddress } from '../../modules/wallet/selectors'

// TOOD: use the values from the store
const mapState = (state: RootState): MapStateProps => ({
  isPickedByUser: getAddress(state) ? Math.floor(Math.random() * 2) > 0 : false,
  count: Math.floor(Math.random() * 5000)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onPick: (item: Item) => dispatch(pickItemAsFavoriteRequest(item)),
  onUnpick: (item: Item) => dispatch(unpickItemAsFavoriteRequest(item))
})

export default connect(mapState, mapDispatch)(FavoritesCounter)
