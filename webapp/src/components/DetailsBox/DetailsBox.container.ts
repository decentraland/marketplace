import { connect } from 'react-redux'
import { RootState } from '../../modules/reducer'
import { getCurrentOrder } from '../../modules/order/selectors'
import { MapStateProps } from './DetailsBox.types'
import DetailsBox from './DetailsBox'

const mapState = (state: RootState): MapStateProps => ({
  order: getCurrentOrder(state) || undefined
})

export default connect(mapState)(DetailsBox)
