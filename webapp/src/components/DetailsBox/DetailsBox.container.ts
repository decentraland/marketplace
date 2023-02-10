import { connect } from 'react-redux'
import { getCurrentOrder } from '../../modules/order/selectors'
import { RootState } from '../../modules/reducer'
import DetailsBox from './DetailsBox'
import { MapStateProps } from './DetailsBox.types'

const mapState = (state: RootState): MapStateProps => ({
  order: getCurrentOrder(state) || undefined
})

export default connect(mapState)(DetailsBox)
