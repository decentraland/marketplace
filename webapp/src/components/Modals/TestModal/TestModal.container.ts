import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { getAddress } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { MapStateProps, MapDispatchProps } from './TestModal.types'
import TestModal from './TestModal'
import { RootState } from '../../../modules/reducer'
import { closeModal } from '../../../modules/modal/actions'

const mapState = (state: RootState): MapStateProps => {
  return {
    address: getAddress(state) || '0xUnD3f1n3D'
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onConfirm: () => dispatch(closeModal('TestModal'))
  }
}

export default connect(mapState, mapDispatch)(TestModal)
