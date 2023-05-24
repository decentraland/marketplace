import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { RootState } from '../../../modules/reducer'
import {
  createListClear,
  createListRequest
} from '../../../modules/favorites/actions'
import {
  isLoadingCreateList,
  getError
} from '../../../modules/favorites/selectors'
import { MapDispatchProps, MapStateProps } from './CreateListModal.types'
import CreateListModal from './CreateListModal'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoading: isLoadingCreateList(state),
    error: getError(state)
  }
}

const mapDispatch = (dispatch: Dispatch, ownProps: any): MapDispatchProps => ({
  onClose: () => {
    dispatch(createListClear())
    return ownProps.onClose()
  },
  ...bindActionCreators({ onCreateList: createListRequest }, dispatch)
})

export default connect(mapState, mapDispatch)(CreateListModal)
