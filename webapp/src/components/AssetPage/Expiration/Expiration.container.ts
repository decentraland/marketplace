import { connect } from 'react-redux'
import { MapStateProps } from './Expiration.types'
import Expiration from './Expiration'
import { RootState } from '../../../modules/reducer'
import { getCurrentOrder } from '../../../modules/order/selectors'

const mapState = (state: RootState): MapStateProps => ({
  order: getCurrentOrder(state) || undefined
})

export default connect(mapState)(Expiration)
