import { connect } from 'react-redux'
import { Item } from '@dcl/schemas'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { bulkPickUnpickStart } from '../../modules/favorites/actions'
import {
  getIsPickedByUser,
  getCount,
  isPickingOrUnpicking
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
    isLoading: isPickingOrUnpicking(state, itemId)
  }
}

const mapDispatch = (
  dispatch: MapDispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  onClick: () => dispatch(bulkPickUnpickStart(ownProps.item)),
  onCounterClick: (item: Item) =>
    dispatch(openModal('FavoritesModal', { itemId: item.id }))
})

export default connect(mapState, mapDispatch)(FavoritesCounter)
