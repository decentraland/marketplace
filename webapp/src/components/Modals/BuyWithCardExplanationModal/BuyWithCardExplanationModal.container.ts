import { connect } from 'react-redux'
import { MapDispatch, MapDispatchProps } from './BuyWithCardExplanationModal.types'
import BuyWithCardExplanationModal from './BuyWithCardExplanationModal'
import { openTransak } from '../../../modules/transak/actions'
import { Asset } from '../../../modules/asset/types'

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onContinue: (asset: Asset) => dispatch(openTransak(asset))
})

export default connect(null, mapDispatch)(BuyWithCardExplanationModal)
