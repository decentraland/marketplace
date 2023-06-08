import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { RootState } from '../../../modules/reducer'
import {
  createListClear,
  createListRequest,
  updateListRequest
} from '../../../modules/favorites/actions'
import {
  isLoadingCreateList,
  getError,
  isLoadingUpdateList
} from '../../../modules/favorites/selectors'
import {
  MapDispatchProps,
  MapStateProps,
  OwnProps
} from './CreateOrEditListModal.types'
import CreateListModal from './CreateOrEditListModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoading: isLoadingCreateList(state) || isLoadingUpdateList(state),
    error: getError(state)
  }
}

const mapDispatch = (
  dispatch: Dispatch,
  ownProps: OwnProps
): MapDispatchProps => ({
  onClose: () => {
    dispatch(createListClear())
    return ownProps.onClose()
  },
  ...bindActionCreators(
    { onCreateList: createListRequest, onEditList: updateListRequest },
    dispatch
  )
})

export default connect(mapState, mapDispatch)(CreateListModal)
