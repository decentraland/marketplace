import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import {
  closeModal,
  openModal
} from 'decentraland-dapps/dist/modules/modal/actions'
import { RootState } from '../../../modules/reducer'
import { bulkPickUnpickRequest } from '../../../modules/favorites/actions'
import { isLoadingBulkPicksUnpicks } from '../../../modules/favorites/selectors'
import { getWallet } from '../../../modules/wallet/selectors'
import { ListOfLists } from '../../../modules/vendor/decentraland/favorites'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './SaveToListModal.types'
import SaveToListModal from './SaveToListModal'
import { OverrideCreateListTypes } from '../CreateOrEditListModal/CreateOrEditListModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
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
  onCreateList: (overrideCreateListData: OverrideCreateListTypes) => {
    dispatch(openModal('CreateOrEditListModal', overrideCreateListData))
  },
  onFinishListCreation: () => dispatch(closeModal('CreateOrEditListModal'))
})

export default connect(mapState, mapDispatch)(SaveToListModal)
