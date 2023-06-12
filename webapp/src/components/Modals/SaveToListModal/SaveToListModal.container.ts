import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { RootState } from '../../../modules/reducer'
import {
  pickItemAsFavoriteRequest,
  unpickItemAsFavoriteRequest
} from '../../../modules/favorites/actions'
import { getCurrentIdentity } from '../../../modules/identity/selectors'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './SaveToListModal.types'
import SaveToListModal from './SaveToListModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    identity: (getCurrentIdentity(state) as AuthIdentity | null) ?? undefined
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps =>
  bindActionCreators(
    {
      onPickItem: (listId: string) =>
        pickItemAsFavoriteRequest(ownProps.metadata.item, listId),
      onUnpickItem: (listId: string) =>
        unpickItemAsFavoriteRequest(ownProps.metadata.item, listId),
      onCreateList: () => undefined
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(SaveToListModal)
