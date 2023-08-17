import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { deleteListRequest } from '../../../modules/favorites/actions'
import { isLoadingDeleteList } from '../../../modules/favorites/selectors'
import { RootState } from '../../../modules/reducer'
import ConfirmDeleteListModal from './ConfirmDeleteListModal'
import { MapDispatchProps, MapStateProps, OwnProps } from './ConfirmDeleteListModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoading: isLoadingDeleteList(state)
  }
}

const mapDispatch = (dispatch: Dispatch, ownProps: OwnProps): MapDispatchProps =>
  bindActionCreators(
    {
      onConfirm: () => deleteListRequest(ownProps.metadata.list)
    },
    dispatch
  )

export default connect(mapState, mapDispatch)(ConfirmDeleteListModal)
