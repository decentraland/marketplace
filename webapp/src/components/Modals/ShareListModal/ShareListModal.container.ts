import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { MapDispatchProps } from './ShareListModal.types'
import ShareListModal from './ShareListModal'

const mapDispatch = (dispatch: Dispatch, ownProps: any): MapDispatchProps => ({
  onClose: () => {
    return ownProps.onClose()
  }
})

export default connect(mapDispatch)(ShareListModal)
