import { connect } from 'react-redux'
import { MapStateProps } from './Sales.types'
import Sales from './Sales'
import { RootState } from '../../modules/reducer'
import { getSales } from '../../modules/sale/selectors'

const mapState = (state: RootState): MapStateProps => {
  return {
    sales: getSales(state)
  }
}

export default connect(mapState)(Sales)
