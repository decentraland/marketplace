import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { closeModal, openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { bulkPickUnpickRequest } from '../../../modules/favorites/actions'
import { isLoadingBulkPicksUnpicks } from '../../../modules/favorites/selectors'
import { getCurrentIdentity } from '../../../modules/identity/selectors'
import { RootState } from '../../../modules/reducer'
import { ListOfLists } from '../../../modules/vendor/decentraland/favorites'
import { OverrideCreateListTypes } from '../CreateOrEditListModal/CreateOrEditListModal.types'
import SaveToListModal from './SaveToListModal'
import { MapDispatchProps, MapStateProps, OwnProps } from './SaveToListModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    identity: (getCurrentIdentity(state) as AuthIdentity | null) ?? undefined,
    isSavingPicks: isLoadingBulkPicksUnpicks(state)
  }
}

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps => ({
  onSavePicks: (picksFor: ListOfLists[], unpickFrom: ListOfLists[]) =>
    dispatch(bulkPickUnpickRequest(ownProps.metadata.item, picksFor, unpickFrom)),
  onCreateList: (overrideCreateListData: OverrideCreateListTypes) => {
    dispatch(openModal('CreateOrEditListModal', overrideCreateListData))
  },
  onFinishListCreation: () => dispatch(closeModal('CreateOrEditListModal'))
})

export default connect(mapState, mapDispatch)(SaveToListModal)
