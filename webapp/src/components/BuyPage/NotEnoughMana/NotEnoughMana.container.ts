import { connect } from 'react-redux'
import { Network } from '@dcl/schemas'
import { openBuyManaWithFiatModalRequest } from 'decentraland-dapps/dist/modules/gateway/actions'
import { openTransak } from '../../../modules/transak/actions'
import { MapDispatchProps, MapDispatch } from './NotEnoughMana.types'
import NotEnoughMana from './NotEnoughMana'

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onGetMana: () => dispatch(openBuyManaWithFiatModalRequest(Network.MATIC)),
  onBuyWithCard: asset => dispatch(openTransak(asset))
})

export default connect(null, mapDispatch)(NotEnoughMana)
