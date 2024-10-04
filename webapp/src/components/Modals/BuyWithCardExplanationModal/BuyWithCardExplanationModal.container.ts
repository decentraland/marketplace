import { connect } from 'react-redux'
import { Order } from '@dcl/schemas'
import { Asset } from '../../../modules/asset/types'
import { openTransak } from '../../../modules/transak/actions'
import BuyWithCardExplanationModal from './BuyWithCardExplanationModal'
import { MapDispatch, MapDispatchProps } from './BuyWithCardExplanationModal.types'

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onContinue: (asset: Asset, order?: Order) => dispatch(openTransak(asset, order))
})

export default connect(null, mapDispatch)(BuyWithCardExplanationModal)
