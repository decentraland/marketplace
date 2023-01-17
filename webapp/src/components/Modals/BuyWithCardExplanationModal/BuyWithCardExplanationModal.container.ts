import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { MapDispatchProps } from './BuyWithCardExplanationModal.types'
import BuyWithCardExplanationModal from './BuyWithCardExplanationModal'

const mapDispatch = (_dispatch: Dispatch): MapDispatchProps => ({
  onContinue: () => {}
})

export default connect(null, mapDispatch)(BuyWithCardExplanationModal)
