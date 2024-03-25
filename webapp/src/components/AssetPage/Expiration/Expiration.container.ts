import { connect } from 'react-redux'
import { getCurrentOrder } from '../../../modules/order/selectors'
import { RootState } from '../../../modules/reducer'
import Expiration from './Expiration'
import { MapStateProps } from './Expiration.types'

const mapState = (state: RootState): MapStateProps => ({
  order: getCurrentOrder(state) || undefined
})

export default connect(mapState)(Expiration)
