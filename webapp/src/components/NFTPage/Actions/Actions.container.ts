import { connect } from 'react-redux'

import { RootState } from '../../../modules/reducer'
import { getWallet } from '../../../modules/wallet/selectors'
import { getCurrentOrder } from '../../../modules/order/selectors'
import { MapStateProps } from './Actions.types'
import Actions from './Actions'

const mapState = (state: RootState): MapStateProps => {
  return {
    wallet: getWallet(state),
    order: getCurrentOrder(state)
  }
}

const mapDispatch = () => ({})

export default connect(mapState, mapDispatch)(Actions)
