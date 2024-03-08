import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatch, MapDispatchProps } from './RecentlySoldTable.types'
import { getLoading, getSales } from '../../modules/sale/selectors'
import { fetchSalesRequest, FETCH_SALES_REQUEST } from '../../modules/sale/actions'
import RecentlySoldTable from './RecentlySoldTable'

const mapState = (state: RootState): MapStateProps => {
  const data = getSales(state)
  return {
    data,
    isLoading: isLoadingType(getLoading(state), FETCH_SALES_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchRecentSales: filters => dispatch(fetchSalesRequest(filters))
})

export default connect(mapState, mapDispatch)(RecentlySoldTable)
