import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { RootState } from '../../../modules/reducer'
import { bulkPickUnpickRequest } from '../../../modules/favorites/actions'
import { isLoadingBulkPicksUnpicks } from '../../../modules/favorites/selectors'
import { getCurrentIdentity } from '../../../modules/identity/selectors'
import { ListOfLists } from '../../../modules/vendor/decentraland/favorites'
import { openModal } from '../../../modules/modal/actions'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './SaveToListModal.types'
import SaveToListModal from './SaveToListModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    identity: (getCurrentIdentity(state) as AuthIdentity | null) ?? undefined,
    isSavingPicks: isLoadingBulkPicksUnpicks(state)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  onSavePicks: (picksFor: ListOfLists[], unpickFrom: ListOfLists[]) =>
    dispatch(
      bulkPickUnpickRequest(ownProps.metadata.item, picksFor, unpickFrom)
    ),
  onCreateList: () => {
    dispatch(openModal('CreateOrEditListModal'))
  }
})

export default connect(mapState, mapDispatch)(SaveToListModal)
