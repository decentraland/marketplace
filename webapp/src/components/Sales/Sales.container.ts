import { connect } from 'react-redux'
import { MapStateProps, MapDispatchProps } from './Sales.types'
import Sales from './Sales'
import { Dispatch } from 'redux'
import { fetchSalesRequest } from '../../modules/sale/actions'
import { getAddress } from '../../modules/wallet/selectors'
import { RootState } from '../../modules/reducer'
import { getSalesBySeller } from '../../modules/sale/selectors'

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)!
  const sales = getSalesBySeller(state)[address]

  return {
    address,
    sales
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onFetchSales: filters => dispatch(fetchSalesRequest(filters))
  }
}

export default connect(mapState, mapDispatch)(Sales)
