import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { RootState } from '../../../modules/reducer'
import { bulkPickUnpickRequest } from '../../../modules/favorites/actions'
import { isLoadingBulkPicksUnpicks } from '../../../modules/favorites/selectors'
import { getCurrentIdentity } from '../../../modules/identity/selectors'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './SaveToListModal.types'
import SaveToListModal from './SaveToListModal'
import { ListOfLists } from '../../../modules/vendor/decentraland/favorites'

const mapState = (state: RootState): MapStateProps => {
  return {
    identity: (getCurrentIdentity(state) as AuthIdentity | null) ?? undefined,
    isSavingPicks: isLoadingBulkPicksUnpicks(state)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps =>
  bindActionCreators(
    {
      onSavePicks: (picksFor: ListOfLists[], unpickFrom: ListOfLists[]) =>
        bulkPickUnpickRequest(ownProps.metadata.item, picksFor, unpickFrom),
      onCreateList: () => undefined
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(SaveToListModal)
