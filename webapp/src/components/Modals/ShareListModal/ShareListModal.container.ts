import { connect } from 'react-redux'
import { MapDispatchProps } from './ShareListModal.types'
import ShareListModal from './ShareListModal'

const mapDispatch = (ownProps: any): MapDispatchProps => ({
  onClose: () => {
    return ownProps.onClose()
  }
})

export default connect(mapDispatch)(ShareListModal)
