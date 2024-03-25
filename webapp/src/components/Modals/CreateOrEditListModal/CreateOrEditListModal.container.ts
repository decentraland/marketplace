import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { createListClear, createListRequest, updateListRequest } from '../../../modules/favorites/actions'
import { isLoadingCreateList, getError, isLoadingUpdateList } from '../../../modules/favorites/selectors'
import { CreateListParameters } from '../../../modules/favorites/types'
import { RootState } from '../../../modules/reducer'
import CreateListModal from './CreateOrEditListModal'
import { MapDispatchProps, MapStateProps, OwnProps } from './CreateOrEditListModal.types'

const mapState = (state: RootState, ownProps: OwnProps): MapStateProps => {
  return {
    isLoading: ownProps.metadata?.isLoading ?? (isLoadingCreateList(state) || isLoadingUpdateList(state)),
    error: ownProps.metadata?.error ?? getError(state)
  }
}

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps => ({
  onClose: () => {
    dispatch(createListClear())
    return ownProps.onClose()
  },
  onCreateList: ownProps.metadata?.onCreateList ?? ((params: CreateListParameters) => dispatch(createListRequest(params))),
  ...bindActionCreators({ onEditList: updateListRequest }, dispatch)
})

export default connect(mapState, mapDispatch)(CreateListModal)
